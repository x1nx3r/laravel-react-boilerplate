<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasUlids;

    public const REQUIRE_REGISTRATION_APPROVAL = 'registration.require_approval';

    protected $fillable = ['key', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember(
            "settings:{$key}",
            now()->addHour(),
            fn (): mixed => static::query()->where('key', $key)->value('value') ?? $default,
        );
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);

        Cache::forget("settings:{$key}");
    }

    /**
     * Whether newly registered accounts require HR verification
     * before they can log in.
     */
    public static function requireRegistrationApproval(): bool
    {
        return static::get(self::REQUIRE_REGISTRATION_APPROVAL, false) == '1';
    }

    public static function setRequireRegistrationApproval(bool $value): void
    {
        static::set(self::REQUIRE_REGISTRATION_APPROVAL, $value ? '1' : '0');
    }
}
