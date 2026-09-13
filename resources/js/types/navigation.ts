import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    /** Permission(s) required to see this item. If multiple, user needs at least one. */
    permissions?: string[];
    /** Role(s) required to see this item. If multiple, user needs at least one. */
    roles?: string[];
    /** Role(s) that should never see this item. */
    excludeRoles?: string[];
    children?: NavItem[];
};
