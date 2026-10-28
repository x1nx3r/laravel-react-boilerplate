import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AttendanceController from '@/actions/App/Http/Controllers/Attendance/AttendanceController';
import LeaveRequestController from '@/actions/App/Http/Controllers/Attendance/LeaveRequestController';
import AttendanceHistory from '@/components/attendance/attendance-history';
import CalendarGrid from '@/components/attendance/calendar-grid';
import LeaveRequestForm from '@/components/attendance/leave-request-form';
import MyLeavesCard from '@/components/attendance/my-leaves-card';
import TodayCard from '@/components/attendance/today-card';
import PageHeader from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type {
    AttendanceHistoryRow,
    BreadcrumbItem,
    CalendarPayload,
    LeaveRequestPayload,
    PaginatedData,
    TodayState,
} from '@/types';

interface AttendanceIndexProps {
    today: TodayState;
    calendar: CalendarPayload;
    history: PaginatedData<AttendanceHistoryRow>;
    leaves: LeaveRequestPayload[];
}

export default function AttendanceIndex({
    today,
    calendar,
    history,
    leaves,
}: AttendanceIndexProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
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
                <PageHeader
                    title={t('attendance.title')}
                    description={t('attendance.description')}
                    actions={
                        canViewAttendance && (
                            <div className="flex flex-wrap gap-2">
                                <Button asChild variant="outline">
                                    <a
                                        href={
                                            AttendanceController.others({
                                                user: auth.user.id,
                                            }).url
                                        }
                                    >
                                        {t('attendance.team_view')}
                                    </a>
                                </Button>
                                <Button asChild variant="outline">
                                    <a
                                        href={
                                            LeaveRequestController.reviewIndex()
                                                .url
                                        }
                                    >
                                        {t('attendance.review_queue')}
                                    </a>
                                </Button>
                            </div>
                        )
                    }
                />

                <div className="grid gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-8">
                        <CalendarGrid
                            calendar={calendar}
                            baseUrl={AttendanceController.index().url}
                        />

                        <AttendanceHistory history={history} />
                    </div>

                    <aside className="space-y-6 xl:col-span-4">
                        <TodayCard today={today} />

                        <LeaveRequestForm />

                        <MyLeavesCard leaves={leaves} />
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
