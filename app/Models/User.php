<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_ACTIVE = 'active';

    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, \Illuminate\Database\Eloquent\Concerns\HasUlids, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        'status',
        'employee_id',
        'nik',
        'birth_place',
        'birth_date',
        'address',
        'employee_status',
        'department',
        'gender',
        'join_date',
        'end_date',
        'major',
        'education_institution',
        'phone_number',
        'bank_account_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'birth_date' => 'date:Y-m-d',
            'join_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
        ];
    }

    /**
     * The documents attached to this user.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(UserDocument::class);
    }
}
