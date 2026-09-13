import { Head, usePage } from '@inertiajs/react';
import { Rocket } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import Heading from '@/components/common/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function Dashboard() {
    const { t } = useTranslation();
    const { name } = usePage().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard.title'),
            href: '/',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('dashboard.welcome_title', { name })}
                    description={t('dashboard.welcome_description')}
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Rocket className="size-4 text-primary" />
                            {t('dashboard.card_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('dashboard.card_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            <Trans
                                i18nKey="dashboard.card_body"
                                components={[
                                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs" />,
                                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs" />,
                                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs" />,
                                ]}
                            />
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
