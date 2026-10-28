import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { UserForm } from '../user-form';

interface CreateProps {
    roles: string[];
}

export default function Create({ roles }: CreateProps) {
    const { t } = useTranslation();

    return (
        <AppLayout
            breadcrumbs={[
                { title: t('users.breadcrumb'), href: '/admin/users' },
                { title: t('users.create'), href: '/admin/users/create' },
            ]}
        >
            <Head title={t('users.create')} />

            <h1 className="text-3xl tracking-tight">{t('users.create')}</h1>

            <Card>
                <CardContent className="pt-6">
                    <UserForm roles={roles} />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
