import {
    CalendarDays,
    ClipboardCheck,
    LayoutGrid,
    ShieldCheck,
} from 'lucide-react';

import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import AttendanceController from '@/actions/App/Http/Controllers/Attendance/AttendanceController';
import LeaveRequestController from '@/actions/App/Http/Controllers/Attendance/LeaveRequestController';
import type { NavItem } from '@/types';

/**
 * Navigation titles are translation keys (resolved by NavMain via t()).
 * Items support optional `permissions`, `roles` and `excludeRoles`
 * arrays — see AppSidebar's filterByPermissions for the gating behavior.
 */
export const mainNavItems: NavItem[] = [
    {
        title: 'nav.dashboard',
        href: '/',
        icon: LayoutGrid,
        permissions: ['view_admin'],
    },
    {
        title: 'nav.attendance',
        href: AttendanceController.index().url,
        icon: CalendarDays,
    },
    {
        title: 'nav.leave_review',
        href: LeaveRequestController.reviewIndex().url,
        icon: ClipboardCheck,
        permissions: ['view_attendance'],
    },
];

/**
 * Admin navigation, gated by permissions.
 * Children are filtered independently of the parent.
 */
export const adminNavItems: NavItem[] = [
    {
        title: 'nav.administration',
        href: '#',
        icon: ShieldCheck,
        permissions: ['view_admin'],
        children: [
            {
                title: 'nav.users',
                href: UserController.index().url,
                permissions: ['manage_users'],
            },
            {
                title: 'nav.roles',
                href: RoleController.index().url,
                permissions: ['manage_roles'],
            },
        ],
    },
];
