import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-shell/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-dvh flex-col bg-background lg:grid-cols-2">
            <aside className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                >
                    <AppLogoIcon className="size-8 fill-current text-sidebar-primary" />
                    {name}
                </Link>
                <p className="max-w-sm text-sm leading-7 text-sidebar-muted">
                    Focused operations for people, attendance, and approvals.
                </p>
                <span className="text-xs text-sidebar-muted">
                    {new Date().getFullYear()}
                </span>
            </aside>
            <main className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm space-y-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 lg:hidden"
                    >
                        <AppLogoIcon className="size-9 fill-current text-primary" />
                        <span className="font-semibold">{name}</span>
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}
