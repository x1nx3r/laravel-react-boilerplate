import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppearanceTabs from '@/components/app-shell/appearance-tabs';
import Heading from '@/components/common/heading';
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

            <h1 className="sr-only">{t('settings.appearance.breadcrumb')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
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
                            <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                                {LANGUAGES.map(({ code, label }) => (
                                    <button
                                        key={code}
                                        onClick={() => setLocale(code)}
                                        className={
                                            locale === code
                                                ? 'rounded-md bg-white px-3.5 py-1.5 text-sm shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                                : 'rounded-md px-3.5 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60'
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
