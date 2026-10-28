import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/common/page-header';
import AppLayout from '@/layouts/app-layout';
import { UserFormGuide } from '../components/user-form-guide';
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

            <div className="w-full space-y-6">
                <PageHeader title={t('users.create')} />

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-8">
                        <UserForm roles={roles} />
                    </div>

                    <aside className="xl:col-span-4">
                        <UserFormGuide />
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
