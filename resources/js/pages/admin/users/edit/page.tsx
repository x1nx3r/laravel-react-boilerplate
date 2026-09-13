import { Head } from '@inertiajs/react';

import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';
import { UserForm } from '../user-form';

interface EditProps {
    user: User;
    roles: string[];
}

export default function Edit({ user, roles }: EditProps) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Users', href: '/admin/users' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title={`Edit user: ${user.name}`} />

            <h1 className="text-2xl font-bold tracking-tight">Edit user</h1>

            <Card>
                <CardContent className="pt-6">
                    <UserForm user={user} roles={roles} />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
