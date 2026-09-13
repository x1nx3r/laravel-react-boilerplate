<?php

namespace App\Policies;

use App\Models\User;
use App\Support\Rbac;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Rbac::PERM_MANAGE_ROLES);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Rbac::PERM_MANAGE_ROLES);
    }

    public function update(User $user, Role $role): bool
    {
        return $user->hasPermissionTo(Rbac::PERM_MANAGE_ROLES)
            && $role->name !== Rbac::ROLE_SUPERADMIN;
    }

    public function delete(User $user, Role $role): bool
    {
        return $this->update($user, $role);
    }
}
