import { Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/sidebar/app-logo';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { adminNavItems, mainNavItems } from '@/config/navigation';
import type { NavItem } from '@/types';

/**
 * Recursively filters nav items based on the user's permissions.
 * An item is visible if:
 *   - It has NO permissions array (public), OR
 *   - The user has at least ONE of the listed permissions.
 * Parent items with children are only shown if at least one child is visible.
 */
function filterByPermissions(
    items: NavItem[],
    userPermissions: string[],
    userRoles: string[],
): NavItem[] {
    return items
        .map((item) => {
            const hasPermission =
                !item.permissions ||
                item.permissions.length === 0 ||
                item.permissions.some((p) => userPermissions.includes(p));

            const hasRole =
                !item.roles ||
                item.roles.length === 0 ||
                item.roles.some((r) => userRoles.includes(r));

            const isExcluded =
                item.excludeRoles &&
                item.excludeRoles.some((r) => userRoles.includes(r));

            if (!hasPermission || !hasRole || isExcluded) return null;

            if (item.children && item.children.length > 0) {
                const filteredChildren = filterByPermissions(
                    item.children,
                    userPermissions,
                    userRoles,
                );
                if (filteredChildren.length === 0) return null;
                return { ...item, children: filteredChildren };
            }

            return item;
        })
        .filter(Boolean) as NavItem[];
}

export function AppSidebar() {
    const { auth } = usePage().props;

    const userPermissions: string[] = (auth.permissions as string[]) ?? [];
    const userRoles: string[] = (auth.roles as string[]) ?? [];

    const visibleNavItems: NavItem[] = [
        ...filterByPermissions(mainNavItems, userPermissions, userRoles),
        ...filterByPermissions(adminNavItems, userPermissions, userRoles),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
