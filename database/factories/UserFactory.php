<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'is_active' => true,
            'status' => User::STATUS_ACTIVE,
            'employee_id' => 'EMP-'.fake()->unique()->numerify('#####'),
            'department' => fake()->randomElement(['HR', 'Marketing', 'Administrasi', 'Operations']),
            'employee_status' => fake()->randomElement(['kontrak', 'tetap']),
            'gender' => fake()->randomElement(['L', 'P']),
            'birth_date' => fake()->dateTimeBetween('-55 years', '-20 years')->format('Y-m-d'),
            'education_level' => fake()->randomElement(['sma', 'smk', 'd3', 's1', 's2', 's3']),
            'join_date' => fake()->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'phone_number' => fake()->phoneNumber(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the account awaits HR verification.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => User::STATUS_PENDING,
        ]);
    }
}
