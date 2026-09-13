<?php

namespace Tests\Feature\Auth;

use App\Models\Setting;
use App\Models\User;
use App\Support\Rbac;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'New Applicant',
            'email' => 'applicant@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], $overrides);
    }

    public function test_registration_creates_active_user_when_approval_is_disabled(): void
    {
        Setting::setRequireRegistrationApproval(false);

        $this->post(route('register'), $this->validPayload());

        $user = User::where('email', 'applicant@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame(User::STATUS_ACTIVE, $user->status);
        $this->assertTrue($user->hasRole(Rbac::ROLE_USER));
    }

    public function test_registration_creates_pending_user_when_approval_is_enabled(): void
    {
        Setting::setRequireRegistrationApproval(true);

        $this->post(route('register'), $this->validPayload());

        $user = User::where('email', 'applicant@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame(User::STATUS_PENDING, $user->status);
    }

    public function test_pending_user_is_logged_out_and_gets_a_clear_message(): void
    {
        Setting::setRequireRegistrationApproval(true);
        $this->post(route('register'), $this->validPayload());

        // Fortify auto-logs-in after registration; the approval middleware
        // bounces the pending session back to the login screen.
        $response = $this->post(route('login'), [
            'email' => 'applicant@example.com',
            'password' => 'password123',
        ]);

        $this->assertGuest();
        $response->assertSessionHas('status', 'Your account is awaiting verification by HR.');

        // A fresh login attempt is rejected with a field error.
        $response = $this->post(route('login'), [
            'email' => 'applicant@example.com',
            'password' => 'password123',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_hr_can_verify_a_pending_user_who_can_then_log_in(): void
    {
        Setting::setRequireRegistrationApproval(true);
        $this->post(route('register'), $this->validPayload());

        $applicant = User::where('email', 'applicant@example.com')->first();
        $hr = User::factory()->create()->assignRole(Rbac::ROLE_HR);

        $this->actingAs($hr)
            ->put(route('admin.users.verify', $applicant))
            ->assertRedirect();

        $this->assertSame(User::STATUS_ACTIVE, $applicant->fresh()->status);

        $this->post(route('logout'));

        $this->post(route('login'), [
            'email' => 'applicant@example.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticatedAs($applicant);
    }

    public function test_registration_validates_hr_attributes(): void
    {
        $response = $this->post(route('register'), $this->validPayload([
            'gender' => 'X',
            'employee_status' => 'magang',
            'end_date' => '2020-01-01',
            'join_date' => '2024-01-01',
        ]));

        $this->assertGuest();
        $response->assertSessionHasErrors(['gender', 'employee_status', 'end_date']);
        $this->assertDatabaseMissing('users', ['email' => 'applicant@example.com']);
    }

    public function test_registration_can_upload_documents_with_thumbnails(): void
    {
        Storage::fake('local');

        $this->post(route('register'), $this->validPayload([
            'documents' => [UploadedFile::fake()->image('ktp.jpg', 800, 800)],
        ]));

        $user = User::where('email', 'applicant@example.com')->first();

        $this->assertCount(1, $user->documents);
        $this->assertSame('ktp.jpg', $user->documents->first()->original_name);
        $this->assertNotNull($user->documents->first()->thumbnail_path);

        Storage::disk('local')->assertExists($user->documents->first()->path);
        Storage::disk('local')->assertExists($user->documents->first()->thumbnail_path);
    }

    public function test_regular_user_cannot_toggle_registration_approval(): void
    {
        $user = User::factory()->create()->assignRole(Rbac::ROLE_USER);

        $this->actingAs($user)
            ->put(route('admin.settings.registration-approval.update'), [
                'require_approval' => true,
            ])
            ->assertForbidden();

        $this->assertFalse(Setting::requireRegistrationApproval());
    }

    public function test_hr_can_toggle_registration_approval(): void
    {
        $hr = User::factory()->create()->assignRole(Rbac::ROLE_HR);

        $this->actingAs($hr)
            ->put(route('admin.settings.registration-approval.update'), [
                'require_approval' => true,
            ])
            ->assertRedirect();

        $this->assertTrue(Setting::requireRegistrationApproval());
    }
}
