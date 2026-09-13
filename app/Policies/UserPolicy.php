<?php

namespace App\Policies;

use App\Models\User;
use App\Support\Rbac;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Rbac::PERM_MANAGE_USERS);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Rbac::PERM_MANAGE_USERS);
    }

    public function update(User $user, User $model): bool
    {
        if (! $user->hasPermissionTo(Rbac::PERM_MANAGE_USERS)) {
            return false;
        }

        // Only superadmins may modify superadmin accounts.
        return $user->hasRole(Rbac::ROLE_SUPERADMIN)
            || ! $model->hasRole(Rbac::ROLE_SUPERADMIN);
    }

    public function delete(User $user, User $model): bool
    {
        return $this->update($user, $model);
    }

    public function verify(User $user, User $model): bool
    {
        return $this->update($user, $model)
            && $model->status === User::STATUS_PENDING;
    }
}
