import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/common/page-header';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';
import { UserDocuments } from '../components/user-documents';
import { UserSummary } from '../components/user-summary';
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

            <div className="w-full space-y-6">
                <PageHeader title={t('users.edit_title')} />

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <UserForm user={user} roles={roles} />

                        <UserDocuments user={user} />
                    </div>

                    <aside className="xl:col-span-4">
                        <UserSummary user={user} />
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
