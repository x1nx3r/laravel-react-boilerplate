import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLogoIcon from '@/components/app-shell/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthEnhancedSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const { t } = useTranslation();

    return (
        <div className="flex min-h-dvh bg-background">
            <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
                <div className="relative z-10 flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                        <AppLogoIcon className="size-7 fill-current" />
                    </span>
                    <span className="text-lg tracking-tight">{name}</span>
                </div>

                <div className="relative z-10 max-w-md">
                    <p className="mb-4 text-xs font-normal tracking-[0.18em] text-sidebar-primary uppercase">
                        {t('auth.shell.eyebrow')}
                    </p>
                    <h1 className="text-4xl tracking-tight">
                        {t('auth.shell.headline')}
                    </h1>
                    <p className="mt-5 text-sm leading-7 text-sidebar-muted">
                        {t('auth.shell.description')}
                    </p>
                </div>

                <div className="relative z-10 border-t border-sidebar-border pt-6 text-xs text-sidebar-muted">
                    {t('auth.shell.footer', {
                        year: new Date().getFullYear(),
                    })}
                </div>
            </aside>

            <main className="flex w-full items-center justify-center p-6 lg:w-[56%] lg:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <AppLogoIcon className="size-6 fill-current" />
                        </span>
                        <span className="text-lg">{name}</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl tracking-tight">{title}</h2>
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
