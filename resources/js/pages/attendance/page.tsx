import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AttendanceController from '@/actions/App/Http/Controllers/Attendance/AttendanceController';
import LeaveRequestController from '@/actions/App/Http/Controllers/Attendance/LeaveRequestController';
import CalendarGrid from '@/components/attendance/calendar-grid';
import LeavesSection from '@/components/attendance/leaves-section';
import TodayCard from '@/components/attendance/today-card';
import Heading from '@/components/common/heading';
import StatusMessage from '@/components/common/status-message';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type {
    BreadcrumbItem,
    CalendarPayload,
    LeaveRequestPayload,
    TodayState,
} from '@/types';

interface AttendanceIndexProps {
    today: TodayState;
    calendar: CalendarPayload;
    leaves: LeaveRequestPayload[];
}

export default function AttendanceIndex({
    today,
    calendar,
    leaves,
}: AttendanceIndexProps) {
    const { t } = useTranslation();
    const { auth, flash } = usePage().props;
    const canViewAttendance = (auth.permissions ?? []).includes(
        'view_attendance',
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attendance.breadcrumb'),
            href: AttendanceController.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('attendance.title')} />
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

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading
                        variant="small"
                        title={t('attendance.title')}
                        description={t('attendance.description')}
                    />
                    {canViewAttendance && (
                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="outline">
                                <a
                                    href={AttendanceController.others({
                                        user: auth.user.id,
                                    }).url}
                                >
                                    {t('attendance.team_view')}
                                </a>
                            </Button>
                            <Button asChild variant="outline">
                                <a href={LeaveRequestController.reviewIndex().url}>
                                    {t('attendance.review_queue')}
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <TodayCard today={today} />
                    <div className="lg:col-span-2">
                        <CalendarGrid
                            calendar={calendar}
                            baseUrl={AttendanceController.index().url}
                        />
                    </div>
                </div>

                <LeavesSection leaves={leaves} />
            </div>
        </AppLayout>
    );
}
