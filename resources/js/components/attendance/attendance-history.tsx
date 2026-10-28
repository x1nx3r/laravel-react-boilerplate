import { useTranslation } from 'react-i18next';
import { Pagination } from '@/components/common/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatDuration } from '@/lib/utils';
import type { AttendanceHistoryRow, PaginatedData } from '@/types';

interface AttendanceHistoryProps {
    history: PaginatedData<AttendanceHistoryRow>;
    title?: string;
}

/**
 * Paginated attendance table. Shared by the personal and team pages.
 */
export default function AttendanceHistory({
    history,
    title,
}: AttendanceHistoryProps) {
    const { t, i18n } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title ?? t('attendance.history.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                {t('attendance.history.date')}
                            </TableHead>
                            <TableHead>
                                {t('attendance.history.check_in')}
                            </TableHead>
                            <TableHead>
                                {t('attendance.history.check_out')}
                            </TableHead>
                            <TableHead className="text-right">
                                {t('attendance.history.duration')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {t('attendance.history.empty')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            history.data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        {formatDate(
                                            row.date,
                                            i18n.language || 'en',
                                        )}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {row.checkIn}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {row.checkOut ?? (
                                            <span className="text-warning">
                                                {t(
                                                    'attendance.history.missing_checkout',
                                                )}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {formatDuration(
                                            row.checkIn,
                                            row.checkOut,
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
    );
}
