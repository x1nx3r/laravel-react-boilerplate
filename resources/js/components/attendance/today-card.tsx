import { useForm } from '@inertiajs/react';
import { CalendarCheck, LogIn, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AttendanceController from '@/actions/App/Http/Controllers/Attendance/AttendanceController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatDuration } from '@/lib/utils';
import type { TodayState } from '@/types';

export default function TodayCard({ today }: { today: TodayState }) {
    const { t } = useTranslation();
    const form = useForm({});

    const submit = (url: string) => form.post(url, { preserveScroll: true });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="size-4 text-primary" />
                    {t('attendance.today.title')}
                </CardTitle>
                <CardDescription>
                    {t('attendance.today.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {today.onLeave ? (
                    <p className="rounded-md bg-info/5 p-3 text-sm text-info">
                        {t('attendance.today.on_leave')}
                    </p>
                ) : (
                    <>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                                <dt className="text-xs text-muted-foreground">
                                    {t('attendance.today.check_in')}
                                </dt>
                                <dd className="tabular-nums">
                                    {today.checkIn ?? '—'}
                                </dd>
                            </div>
                            <div className="space-y-1">
                                <dt className="text-xs text-muted-foreground">
                                    {t('attendance.today.check_out')}
                                </dt>
                                <dd className="tabular-nums">
                                    {today.checkOut ?? '—'}
                                </dd>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <dt className="text-xs text-muted-foreground">
                                    {t('attendance.today.duration')}
                                </dt>
                                <dd className="tabular-nums">
                                    {formatDuration(
                                        today.checkIn,
                                        today.checkOut,
                                    )}
                                </dd>
                            </div>
                        </dl>

                        {!today.checkIn && (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    {t('attendance.today.ready')}
                                </p>
                                <Button
                                    size="lg"
                                    className="w-full"
                                    disabled={form.processing}
                                    onClick={() =>
                                        submit(
                                            AttendanceController.checkIn().url,
                                        )
                                    }
                                >
                                    <LogIn className="size-4" />
                                    {t('attendance.today.check_in')}
                                </Button>
                            </>
                        )}

                        {today.checkIn && !today.checkOut && (
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full"
                                disabled={form.processing}
                                onClick={() =>
                                    submit(AttendanceController.checkOut().url)
                                }
                            >
                                <LogOut className="size-4" />
                                {t('attendance.today.check_out')}
                            </Button>
                        )}

                        {today.checkIn && today.checkOut && (
                            <p className="rounded-md bg-success/5 p-3 text-sm font-normal text-success">
                                {t('attendance.today.checked_out_at', {
                                    time: today.checkOut,
                                })}
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
