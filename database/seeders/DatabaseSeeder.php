<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\Rbac;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (array_unique(array_merge(...array_values(Rbac::rolePermissions()))) as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        foreach (Rbac::rolePermissions() as $roleName => $permissions) {
            Role::firstOrCreate(['name' => $roleName])
                ->syncPermissions($permissions);
        }

        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ])->assignRole(Rbac::ROLE_SUPERADMIN);

        User::create([
            'name' => 'HR Staff',
            'email' => 'hr@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ])->assignRole(Rbac::ROLE_HR);

        User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ])->assignRole(Rbac::ROLE_USER);
    }
}
