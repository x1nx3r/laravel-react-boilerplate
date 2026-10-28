import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AttendanceDayStatus, CalendarPayload } from '@/types';

const cellStyles: Record<AttendanceDayStatus, string> = {
    present: 'bg-success/10 text-success',
    in_progress: 'bg-warning/10 text-warning',
    leave: 'bg-info/10 text-info',
    weekend: 'bg-muted/50 text-muted-foreground',
    absent: 'bg-destructive/10 text-destructive',
    upcoming: 'text-muted-foreground/60',
};

const legendItems: { status: AttendanceDayStatus; dot: string }[] = [
    { status: 'present', dot: 'bg-success' },
    { status: 'in_progress', dot: 'bg-warning' },
    { status: 'leave', dot: 'bg-info' },
    { status: 'absent', dot: 'bg-destructive' },
    { status: 'weekend', dot: 'bg-muted-foreground/40' },
];

// 2024-09-02 is a Monday — reference week for Monday-first labels.
const weekdayLabels = (locale: string): string[] =>
    Array.from({ length: 7 }, (_, i) =>
        new Date(2024, 8, 2 + i).toLocaleDateString(locale, {
            weekday: 'short',
        }),
    );

interface CalendarGridProps {
    calendar: CalendarPayload;
    baseUrl: string;
}

export default function CalendarGrid({ calendar, baseUrl }: CalendarGridProps) {
    const { t, i18n } = useTranslation();

    const monthTitle = new Date(
        calendar.year,
        calendar.month - 1,
        1,
    ).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });

    const daysInMonth = new Date(calendar.year, calendar.month, 0).getDate();
    // Monday-first offset of the 1st: Mon=0 ... Sun=6.
    const leadingBlanks =
        (new Date(calendar.year, calendar.month - 1, 1).getDay() + 6) % 7;

    const cells: { key: string; day: number }[] = Array.from(
        { length: daysInMonth },
        (_, i) => ({
            key: `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
            day: i + 1,
        }),
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">{monthTitle}</CardTitle>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            asChild
                            aria-label={t('attendance.calendar.prev_month')}
                        >
                            <Link href={`${baseUrl}?month=${calendar.prev}`}>
                                <ChevronLeft className="size-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            asChild
                            aria-label={t('attendance.calendar.next_month')}
                        >
                            <Link href={`${baseUrl}?month=${calendar.next}`}>
                                <ChevronRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                    {weekdayLabels(i18n.language).map((label) => (
                        <div key={label} className="py-1">
                            {label}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: leadingBlanks }, (_, i) => (
                        <div key={`blank-${i}`} />
                    ))}
                    {cells.map(({ key, day }) => {
                        const status = calendar.days[key];

                        return (
                            <div
                                key={key}
                                title={
                                    status
                                        ? t(`attendance.status.${status}`)
                                        : undefined
                                }
                                className={cn(
                                    'flex h-10 items-center justify-center rounded-md text-sm',
                                    status && cellStyles[status],
                                    key === calendar.today &&
                                        'ring-2 ring-primary ring-offset-1 ring-offset-background',
                                )}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
                    {legendItems.map(({ status, dot }) => (
                        <span
                            key={status}
                            className="flex items-center gap-1.5"
                        >
                            <span
                                className={cn('size-2.5 rounded-full', dot)}
                            />
                            {t(`attendance.status.${status}`)}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
