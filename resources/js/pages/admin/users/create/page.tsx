import { Head } from '@inertiajs/react';

import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { UserForm } from '../user-form';

interface CreateProps {
    roles: string[];
}

export default function Create({ roles }: CreateProps) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Users', href: '/admin/users' },
                { title: 'Create', href: '/admin/users/create' },
            ]}
        >
            <Head title="Create user" />

            <h1 className="text-2xl font-bold tracking-tight">Create user</h1>

            <Card>
                <CardContent className="pt-6">
                    <UserForm roles={roles} />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
