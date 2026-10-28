import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppearanceTabs from '@/components/app-shell/appearance-tabs';
import PageHeader from '@/components/common/page-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import type { BreadcrumbItem } from '@/types';

const LANGUAGES = [
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'en', label: 'English' },
];

export default function Appearance() {
    const { t } = useTranslation();
    const [locale, setLocale] = useLocale();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('settings.appearance.breadcrumb'),
            href: editAppearance().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.appearance.breadcrumb')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <PageHeader
                        title={t('settings.appearance.title')}
                        description={t('settings.appearance.description')}
                    />
                    <AppearanceTabs />

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('settings.appearance.language')}
                            </CardTitle>
                            <CardDescription>
                                {t('settings.appearance.language_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
                                {LANGUAGES.map(({ code, label }) => (
                                    <button
                                        key={code}
                                        onClick={() => setLocale(code)}
                                        className={
                                            locale === code
                                                ? 'rounded-md bg-card px-3.5 py-1.5 text-sm font-normal text-foreground shadow-xs'
                                                : 'rounded-md px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground'
                                        }
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
