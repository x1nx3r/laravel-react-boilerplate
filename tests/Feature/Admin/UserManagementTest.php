<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Support\Rbac;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
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

    public function test_superadmin_can_view_users_index(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_SUPERADMIN);

        $this->actingAs($actor)->get(route('admin.users.index'))->assertOk();
    }

    public function test_hr_can_view_users_index(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_HR);

        $this->actingAs($actor)->get(route('admin.users.index'))->assertOk();
    }

    public function test_regular_user_cannot_view_users_index(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_USER);

        $this->actingAs($actor)->get(route('admin.users.index'))->assertForbidden();
    }

    public function test_hr_can_create_user_without_superadmin_role(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_HR);

        $response = $this->actingAs($actor)->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => 'new-user@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => Rbac::ROLE_USER,
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseHas('users', ['email' => 'new-user@example.com']);
        $this->assertTrue(User::where('email', 'new-user@example.com')->first()->hasRole(Rbac::ROLE_USER));
    }

    public function test_hr_cannot_assign_superadmin_role(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_HR);

        $this->actingAs($actor)->post(route('admin.users.store'), [
            'name' => 'Escalated User',
            'email' => 'escalated@example.com',
            'password' => 'password123',
            'role' => Rbac::ROLE_SUPERADMIN,
        ])->assertSessionHasErrors('role');

        $this->assertDatabaseMissing('users', ['email' => 'escalated@example.com']);
    }

    public function test_hr_cannot_edit_superadmin_user(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_HR);
        $target = $this->userWithRole(Rbac::ROLE_SUPERADMIN);

        $this->actingAs($actor)
            ->get(route('admin.users.edit', $target))
            ->assertForbidden();

        $this->actingAs($actor)
            ->put(route('admin.users.update', $target), [
                'name' => 'Hacked Name',
                'email' => $target->email,
                'role' => Rbac::ROLE_USER,
                'is_active' => true,
            ])
            ->assertForbidden();

        $this->assertNotSame('Hacked Name', $target->fresh()->name);
    }

    public function test_superadmin_can_edit_any_user(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_SUPERADMIN);
        $target = $this->userWithRole(Rbac::ROLE_HR);

        $this->actingAs($actor)
            ->put(route('admin.users.update', $target), [
                'name' => 'Renamed HR',
                'email' => $target->email,
                'role' => Rbac::ROLE_HR,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.users.index'));

        $this->assertSame('Renamed HR', $target->fresh()->name);
    }

    public function test_user_cannot_delete_own_account(): void
    {
        $actor = $this->userWithRole(Rbac::ROLE_SUPERADMIN);

        $this->actingAs($actor)
            ->delete(route('admin.users.destroy', $actor))
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertNotNull($actor->fresh());
    }

    public function test_deactivated_user_cannot_log_in(): void
    {
        User::factory()->create([
            'email' => 'inactive@example.com',
            'password' => 'password123',
            'is_active' => false,
        ]);

        $this->post(route('login'), [
            'email' => 'inactive@example.com',
            'password' => 'password123',
        ]);

        $this->assertGuest();
    }
}
