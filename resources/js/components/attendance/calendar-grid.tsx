import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AttendanceDayStatus, CalendarPayload } from '@/types';

const cellStyles: Record<AttendanceDayStatus, string> = {
    present:
        'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    in_progress:
        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    leave: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    weekend: 'bg-muted/50 text-muted-foreground',
    absent: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    upcoming: 'text-muted-foreground/60',
};

const legendItems: { status: AttendanceDayStatus; dot: string }[] = [
    { status: 'present', dot: 'bg-green-500' },
    { status: 'in_progress', dot: 'bg-amber-500' },
    { status: 'leave', dot: 'bg-blue-500' },
    { status: 'absent', dot: 'bg-red-400' },
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
