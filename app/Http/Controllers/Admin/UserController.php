<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\SavesUserDocuments;
use App\Concerns\UserAttributeRules;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserDocument;
use App\Support\Rbac;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use SavesUserDocuments, UserAttributeRules;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::with('roles')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->role, fn ($query, $role) => $query->role($role))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->status))
            ->when($request->filled('is_active'), fn ($query) => $query->where('is_active', $request->boolean('is_active')))
            ->when($request->department, fn ($query, $department) => $query->where('department', $department))
            ->when($request->employee_status, fn ($query, $employeeStatus) => $query->where('employee_status', $employeeStatus))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/page', [
            'users' => $users,
            'roles' => Role::orderBy('name')->pluck('name'),
            'departments' => User::whereNotNull('department')
                ->where('department', '!=', '')
                ->distinct()
                ->orderBy('department')
                ->pluck('department'),
            'filters' => $request->only(['search', 'role', 'status', 'is_active', 'department', 'employee_status']),
            'requireRegistrationApproval' => Setting::requireRegistrationApproval(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('admin/users/create/page', [
            'roles' => $this->assignableRoles(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => $request->boolean('is_active'),
            'status' => User::STATUS_ACTIVE,
            ...$this->userAttributes($request->all()),
        ]);

        $user->assignRole($request->role);

        if ($request->hasFile('documents')) {
            $this->saveUserDocuments($user, $request->file('documents'));
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User created.');
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('admin/users/edit/page', [
            'user' => $user->load(['roles', 'documents']),
            'roles' => $this->assignableRoles(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $isSelf = $request->user()->is($user);
        $roleChanged = ! $user->hasRole($request->role);

        if ($isSelf && ($roleChanged || ! $request->boolean('is_active'))) {
            return back()->with('error', 'You cannot change your own role or deactivate your own account.');
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'is_active' => $request->boolean('is_active'),
            ...$this->userAttributes($request->all()),
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        $user->syncRoles([$request->role]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User updated.');
    }

    public function verify(Request $request, User $user): RedirectResponse
    {
        $this->authorize('verify', $user);

        $user->update(['status' => User::STATUS_ACTIVE]);

        return back()->with('success', 'User verified and activated.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        if ($request->user()->is($user)) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User deleted.');
    }

    public function storeDocument(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $request->validate([
            'documents' => ['required', 'array', 'min:1'],
            'documents.*' => ['required', 'file', 'max:10240'], // 10 MB max per file
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        $this->saveUserDocuments($user, $request->file('documents'), $request->category);

        return back()->with('success', 'Document uploaded.');
    }

    public function showDocument(Request $request, User $user, UserDocument $document)
    {
        $this->authorize('update', $user);

        abort_if($document->user_id !== $user->id, 404);

        $path = $request->boolean('thumbnail')
            ? ($document->thumbnail_path ?? $document->path)
            : $document->path;

        if (! Storage::disk('local')->exists($path)) {
            abort(404);
        }

        return Storage::disk('local')->response($path, $document->original_name);
    }

    public function destroyDocument(Request $request, User $user, UserDocument $document): RedirectResponse
    {
        $this->authorize('update', $user);

        abort_if($document->user_id !== $user->id, 404);

        if ($document->thumbnail_path) {
            Storage::disk('local')->delete($document->thumbnail_path);
        }
        Storage::disk('local')->delete($document->path);
        $document->delete();

        return back()->with('success', 'Document deleted.');
    }

    /**
     * Roles the current actor may assign. Only actors with
     * manage_roles may assign the superadmin role.
     *
     * @return list<string>
     */
    private function assignableRoles(): array
    {
        $roles = Role::orderBy('name')->pluck('name');

        if (! auth()->user()->hasPermissionTo(Rbac::PERM_MANAGE_ROLES)) {
            $roles = $roles->reject(fn (string $name) => $name === Rbac::ROLE_SUPERADMIN)->values();
        }

        return $roles->all();
    }
}
