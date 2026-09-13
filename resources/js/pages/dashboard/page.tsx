import { Head, usePage } from '@inertiajs/react';
import { Rocket } from 'lucide-react';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/',
    },
];

export default function Dashboard() {
    const { name } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={`Welcome to ${name}`}
                    description="Your application skeleton is ready."
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Rocket className="size-4 text-primary" />
                            Scaffolded and ready
                        </CardTitle>
                        <CardDescription>
                            Auth, settings, the layout shell and CI are wired
                            up. Replace this page with your first module.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Add routes in{' '}
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                                routes/web.php
                            </code>
                            , pages under{' '}
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                                resources/js/pages
                            </code>{' '}
                            and navigation entries in{' '}
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                                resources/js/config/navigation.ts
                            </code>
                            .
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
