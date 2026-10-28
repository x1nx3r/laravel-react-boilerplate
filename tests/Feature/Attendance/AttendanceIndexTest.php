<?php

namespace Tests\Feature\Attendance;

use App\Models\Attendance;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AttendanceIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_index_returns_the_current_users_attendance_history(): void
    {
        $user = User::factory()->create();

        Attendance::factory()->on(now()->subDay()->toDateString(), '08:02', '17:01')->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user)
            ->get(route('attendance.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('attendance/page')
                ->has('history.data', 1)
                ->where('history.data.0.checkIn', '08:02')
                ->where('history.data.0.checkOut', '17:01')
            );
    }

    public function test_index_only_returns_the_current_users_rows(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Attendance::factory()->on(now()->subDay()->toDateString(), '08:00', '17:00')->create([
            'user_id' => $other->id,
        ]);

        $this->actingAs($user)
            ->get(route('attendance.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('history.data', 0));
    }
}
