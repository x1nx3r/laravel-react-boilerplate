import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';
import { UserDocuments } from '../components/user-documents';
import { UserForm } from '../user-form';

interface EditProps {
    user: User;
    roles: string[];
}

export default function Edit({ user, roles }: EditProps) {
    const { t } = useTranslation();

    return (
        <AppLayout
            breadcrumbs={[
                { title: t('users.breadcrumb'), href: '/admin/users' },
                { title: t('common.edit'), href: '#' },
            ]}
        >
            <Head title={`${t('users.edit_title')}: ${user.name}`} />

            <h1 className="text-3xl font-semibold tracking-tight">
                {t('users.edit_title')}
            </h1>

            <Card>
                <CardContent className="pt-6">
                    <UserForm user={user} roles={roles} />
                </CardContent>
            </Card>

            <UserDocuments user={user} />
        </AppLayout>
    );
}
