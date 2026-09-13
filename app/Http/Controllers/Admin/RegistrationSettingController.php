<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\Rbac;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RegistrationSettingController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        abort_unless($request->user()->hasPermissionTo(Rbac::PERM_MANAGE_USERS), 403);

        $request->validate([
            'require_approval' => ['required', 'boolean'],
        ]);

        Setting::setRequireRegistrationApproval($request->boolean('require_approval'));

        return back()->with('success', __('app.registration.updated'));
    }
}
