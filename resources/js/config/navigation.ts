import { LayoutGrid, ShieldCheck } from 'lucide-react';

import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import type { NavItem } from '@/types';

/**
 * Navigation items visible to ALL authenticated users.
 * No permissions required.
 */
export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/',
        icon: LayoutGrid,
    },
];

/**
 * Admin navigation, gated by permissions.
 * Children are filtered independently of the parent.
 */
export const adminNavItems: NavItem[] = [
    {
        title: 'Administration',
        href: '#',
        icon: ShieldCheck,
        permissions: ['view_admin'],
        children: [
            {
                title: 'Users',
                href: UserController.index().url,
                permissions: ['manage_users'],
            },
            {
                title: 'Roles',
                href: RoleController.index().url,
                permissions: ['manage_roles'],
            },
        ],
    },
];
