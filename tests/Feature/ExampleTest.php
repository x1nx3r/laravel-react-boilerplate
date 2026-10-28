<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\Rbac;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_guests_are_redirected_to_login()
    {
        $response = $this->get('/');

        $response->assertRedirect(route('login', absolute: false));
    }

    public function test_dashboard_renders_for_authenticated_users()
    {
        $user = User::factory()->create()->assignRole(Rbac::ROLE_SUPERADMIN);

        $response = $this->actingAs($user)->get('/');

        $response->assertOk();
    }
}
