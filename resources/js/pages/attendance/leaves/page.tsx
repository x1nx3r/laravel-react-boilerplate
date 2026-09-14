import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AttendanceController from '@/actions/App/Http/Controllers/Attendance/AttendanceController';
import LeavesSection from '@/components/attendance/leaves-section';
import Heading from '@/components/common/heading';
import StatusMessage from '@/components/common/status-message';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, LeaveRequestPayload } from '@/types';

interface LeaveIndexProps {
    leaves: LeaveRequestPayload[];
}

export default function LeaveIndex({ leaves }: LeaveIndexProps) {
    const { t } = useTranslation();
    const { flash } = usePage().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attendance.breadcrumb'),
            href: AttendanceController.index().url,
        },
        { title: t('leaves.breadcrumb'), href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('leaves.title')} />
            <div className="space-y-6">
                {flash.success && (
                    <StatusMessage
                        message={flash.success}
                        type="success"
                        autoHide
                    />
                )}
                {flash.error && (
                    <StatusMessage
                        message={flash.error}
                        type="error"
                        autoHide
                    />
                )}

                <Heading
                    variant="small"
                    title={t('leaves.title')}
                    description={t('leaves.description')}
                />

                <LeavesSection leaves={leaves} />
            </div>
        </AppLayout>
    );
}
