<?php

namespace Database\Factories;

use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-30 days', '+30 days');

        return [
            'user_id' => User::factory(),
            'start_date' => $start->format('Y-m-d'),
            'end_date' => $start->format('Y-m-d'),
            'reason' => fake()->sentence(),
            'status' => LeaveRequest::STATUS_PENDING,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ];
    }

    /**
     * Mark the request as approved by a reviewer.
     */
    public function approved(?User $reviewer = null): static
    {
        return $this->state(fn () => [
            'status' => LeaveRequest::STATUS_APPROVED,
            'reviewed_by' => $reviewer?->id,
            'reviewed_at' => now(),
        ]);
    }

    /**
     * Mark the request as rejected by a reviewer.
     */
    public function rejected(?User $reviewer = null): static
    {
        return $this->state(fn () => [
            'status' => LeaveRequest::STATUS_REJECTED,
            'reviewed_by' => $reviewer?->id,
            'reviewed_at' => now(),
        ]);
    }
}
