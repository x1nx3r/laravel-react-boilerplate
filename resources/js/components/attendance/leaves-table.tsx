import { useTranslation } from 'react-i18next';
import LeaveStatusBadge from '@/components/attendance/leave-status-badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { LeaveRequestPayload } from '@/types';

export default function LeavesTable({ leaves }: { leaves: LeaveRequestPayload[] }) {
    const { t } = useTranslation();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t('leaves.table.dates')}</TableHead>
                    <TableHead>{t('leaves.table.reason')}</TableHead>
                    <TableHead>{t('leaves.table.status')}</TableHead>
                    <TableHead>{t('leaves.table.reviewer')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaves.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={4}
                            className="h-24 text-center text-muted-foreground"
                        >
                            {t('leaves.table.empty')}
                        </TableCell>
                    </TableRow>
                ) : (
                    leaves.map((leave) => (
                        <TableRow key={leave.id}>
                            <TableCell className="whitespace-nowrap">
                                {leave.startDate} – {leave.endDate}
                            </TableCell>
                            <TableCell className="max-w-xs text-sm">
                                {leave.reason}
                            </TableCell>
                            <TableCell>
                                <LeaveStatusBadge status={leave.status} />
                            </TableCell>
                            <TableCell>
                                {leave.reviewerName ? (
                                    <div>
                                        <div className="text-sm">
                                            {leave.reviewerName}
                                        </div>
                                        {leave.reviewerNote && (
                                            <div className="text-xs text-muted-foreground">
                                                {t('leaves.table.note')}:{' '}
                                                {leave.reviewerNote}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">
                                        —
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
