import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-shell/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthEnhancedSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="flex min-h-dvh bg-background">
            <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
                <div className="relative z-10 flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                        <AppLogoIcon className="size-7 fill-current" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight">
                        {name}
                    </span>
                </div>

                <div className="relative z-10 max-w-md">
                    <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-sidebar-primary uppercase">
                        Operations workspace
                    </p>
                    <h1 className="text-4xl font-semibold tracking-tight">
                        People, attendance, and approvals in one place.
                    </h1>
                    <p className="mt-5 text-sm leading-7 text-sidebar-muted">
                        A focused workspace for the people who keep the
                        organization running.
                    </p>
                </div>

                <div className="relative z-10 border-t border-sidebar-border pt-6 text-xs text-sidebar-muted">
                    Internal operations · {new Date().getFullYear()}
                </div>
            </aside>

            <main className="flex w-full items-center justify-center p-6 lg:w-[56%] lg:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <AppLogoIcon className="size-6 fill-current" />
                        </span>
                        <span className="text-lg font-semibold">{name}</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-xs sm:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
