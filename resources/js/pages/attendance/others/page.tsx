import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AttendanceController from '@/actions/App/Http/Controllers/Attendance/AttendanceController';
import AttendanceHistory from '@/components/attendance/attendance-history';
import CalendarGrid from '@/components/attendance/calendar-grid';
import LeavesTable from '@/components/attendance/leaves-table';
import PageHeader from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type {
    AttendanceHistoryRow,
    BreadcrumbItem,
    CalendarPayload,
    LeaveRequestPayload,
    PaginatedData,
    UserOption,
} from '@/types';

interface AttendanceOthersProps {
    users: UserOption[];
    selectedUser: UserOption;
    calendar: CalendarPayload;
    history: PaginatedData<AttendanceHistoryRow>;
    leaves: LeaveRequestPayload[];
}

export default function AttendanceOthers({
    users,
    selectedUser,
    calendar,
    history,
    leaves,
}: AttendanceOthersProps) {
    const { t } = useTranslation();

    const selectUser = (userId: string) => {
        router.get(
            AttendanceController.others({ user: userId }).url,
            {},
            { preserveState: true },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attendance.breadcrumb'),
            href: AttendanceController.index().url,
        },
        { title: t('attendance.team.breadcrumb'), href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('attendance.team.title')} />
            <div className="space-y-6">
                <PageHeader
                    title={t('attendance.team.title')}
                    description={t('attendance.team.description')}
                    actions={
                        <>
                            <span className="text-sm text-muted-foreground">
                                {t('attendance.team.picker_label')}
                            </span>
                            <Select
                                value={selectedUser.id}
                                onValueChange={selectUser}
                            >
                                <SelectTrigger className="w-56">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-sm">
                                {t('attendance.team.selected')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="font-normal">
                                {selectedUser.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {selectedUser.email}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="lg:col-span-2">
                        <CalendarGrid
                            calendar={calendar}
                            baseUrl={
                                AttendanceController.others({
                                    user: selectedUser.id,
                                }).url
                            }
                        />
                    </div>
                </div>

                <AttendanceHistory
                    history={history}
                    title={t('attendance.team.history_title')}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('attendance.team.leaves_title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <LeavesTable leaves={leaves} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
