<?php

namespace App\Support;

/**
 * Central registry of RBAC roles and permissions.
 */
final class Rbac
{
    public const ROLE_SUPERADMIN = 'superadmin';

    public const ROLE_HR = 'hr';

    public const ROLE_USER = 'user';

    public const PERM_VIEW_ADMIN = 'view_admin';

    public const PERM_MANAGE_USERS = 'manage_users';

    public const PERM_MANAGE_ROLES = 'manage_roles';

    /**
     * @return array<string, list<string>>
     */
    public static function rolePermissions(): array
    {
        return [
            self::ROLE_SUPERADMIN => [
                self::PERM_VIEW_ADMIN,
                self::PERM_MANAGE_USERS,
                self::PERM_MANAGE_ROLES,
            ],
            self::ROLE_HR => [
                self::PERM_VIEW_ADMIN,
                self::PERM_MANAGE_USERS,
            ],
            self::ROLE_USER => [],
        ];
    }
}
