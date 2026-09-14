<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('-30 days', 'now')->setTime(8, fake()->numberBetween(0, 59));

        return [
            'user_id' => User::factory(),
            'date' => $checkIn->format('Y-m-d'),
            'check_in_at' => $checkIn,
            'check_out_at' => null,
        ];
    }

    /**
     * A completed day with a check-out.
     */
    public function checkedOut(): static
    {
        return $this->state(fn (array $attributes) => [
            'check_out_at' => Carbon::parse($attributes['check_in_at'])->addHours(9),
        ]);
    }

    /**
     * A full explicit row (overrides date + times).
     */
    public function on(string $date, string $checkIn, ?string $checkOut = null): static
    {
        return $this->state(fn () => [
            'date' => $date,
            'check_in_at' => $date.' '.$checkIn,
            'check_out_at' => $checkOut === null ? null : $date.' '.$checkOut,
        ]);
    }
}
