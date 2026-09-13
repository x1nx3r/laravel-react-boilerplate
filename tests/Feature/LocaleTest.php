<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_locale_cookie_is_shared_with_the_frontend(): void
    {
        $response = $this->withUnencryptedCookies([
            'locale' => 'en',
        ])->get(route('login'));

        $response->assertSee('<html lang="en">', false);
    }

    public function test_invalid_locale_cookie_falls_back_to_the_default(): void
    {
        $response = $this->withUnencryptedCookies([
            'locale' => 'xx',
        ])->get(route('login'));

        // APP_LOCALE is en in the test environment (phpunit.xml).
        $response->assertSee('<html lang="en">', false);
    }

    public function test_validation_messages_use_the_active_locale(): void
    {
        $user = User::factory()->create();

        $response = $this->withUnencryptedCookies([
            'locale' => 'id',
        ])->post(route('login'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');

        $errors = session('errors');

        $this->assertStringContainsString(
            'tidak cocok',
            $errors->get('email')[0],
        );
    }
}
