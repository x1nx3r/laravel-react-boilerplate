<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Support\Rbac;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    private function userWithRole(string $role): User
    {
        return User::factory()->create()->assignRole($role);
    }

    public function test_superadmin_can_view_roles_index(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_SUPERADMIN);

        $this->actingAs($actor)->get(route('admin.roles.index'))->assertOk();
    }

    public function test_hr_cannot_view_roles_index(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_HR);

        $this->actingAs($actor)->get(route('admin.roles.index'))->assertForbidden();
    }

    public function test_superadmin_can_create_role_with_permissions(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_SUPERADMIN);

        $this->actingAs($actor)->post(route('admin.roles.store'), [
            'name' => 'manager',
            'permissions' => [Rbac::PERM_VIEW_ADMIN],
        ])->assertRedirect();

        $role = Role::where('name', 'manager')->first();

        $this->assertNotNull($role);
        $this->assertTrue($role->hasPermissionTo(Rbac::PERM_VIEW_ADMIN));
    }

    public function test_superadmin_role_cannot_be_updated(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_SUPERADMIN);
        $role = Role::where('name', Rbac::ROLE_SUPERADMIN)->first();

        $this->actingAs($actor)
            ->put(route('admin.roles.update', $role), [
                'name' => 'renamed',
            ])
            ->assertForbidden();

        $this->assertSame(Rbac::ROLE_SUPERADMIN, $role->fresh()->name);
    }

    public function test_superadmin_role_cannot_be_deleted(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_SUPERADMIN);
        $role = Role::where('name', Rbac::ROLE_SUPERADMIN)->first();

        $this->actingAs($actor)
            ->delete(route('admin.roles.destroy', $role))
            ->assertForbidden();

        $this->assertNotNull($role->fresh());
    }

    public function test_role_with_users_cannot_be_deleted(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_SUPERADMIN);
        $role = Role::where('name', Rbac::ROLE_HR)->first();

        $this->actingAs($actor)
            ->delete(route('admin.roles.destroy', $role))
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertNotNull($role->fresh());
    }
}
