import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AttendanceController from '@/actions/App/Http/Controllers/Attendance/AttendanceController';
import CalendarGrid from '@/components/attendance/calendar-grid';
import LeavesTable from '@/components/attendance/leaves-table';
import { Pagination } from '@/components/common/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl tracking-tight">
                            {t('attendance.team.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('attendance.team.description')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
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
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

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

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('attendance.team.history_title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {t('attendance.team.table.date')}
                                    </TableHead>
                                    <TableHead>
                                        {t('attendance.team.table.check_in')}
                                    </TableHead>
                                    <TableHead>
                                        {t('attendance.team.table.check_out')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            {t('attendance.team.empty')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    history.data.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.checkIn}</TableCell>
                                            <TableCell>
                                                {row.checkOut ?? (
                                                    <span className="text-warning">
                                                        {t(
                                                            'attendance.team.table.missing_checkout',
                                                        )}
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <Pagination meta={history} />
                    </CardContent>
                </Card>

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
