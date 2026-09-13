import { LayoutGrid } from 'lucide-react';
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
