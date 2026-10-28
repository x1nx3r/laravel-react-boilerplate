import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    const { isCurrentUrl } = useCurrentUrl();

    const sidebarNavItems: NavItem[] = [
        {
            title: t('settings.tabs.profile'),
            href: edit(),
            icon: null,
        },
        {
            title: t('settings.tabs.password'),
            href: editPassword(),
            icon: null,
        },
        {
            title: t('settings.tabs.appearance'),
            href: editAppearance(),
            icon: null,
        },
    ];

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <aside className="lg:w-48">
                <nav
                    className="flex flex-col gap-1"
                    aria-label={t('settings.title')}
                >
                    {sidebarNavItems.map((item, index) => (
                        <Button
                            key={`${toUrl(item.href)}-${index}`}
                            size="sm"
                            variant="ghost"
                            asChild
                            className={cn('w-full justify-start', {
                                'bg-accent text-accent-foreground':
                                    isCurrentUrl(item.href),
                            })}
                        >
                            <Link href={item.href}>
                                {item.icon && <item.icon className="h-4 w-4" />}
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </aside>

            <Separator className="lg:hidden" />

            <div className="w-full flex-1">{children}</div>
        </div>
    );
}
