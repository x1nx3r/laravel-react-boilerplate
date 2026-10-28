import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LeaveStatus } from '@/types';

const statusStyles: Record<LeaveStatus, string> = {
    pending: 'bg-warning/10 text-warning hover:bg-warning/15',
    approved: 'bg-success/10 text-success hover:bg-success/15',
    rejected: 'bg-destructive/10 text-destructive hover:bg-destructive/15',
};

export default function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
    const { t } = useTranslation();

    return (
        <Badge className={cn('border-transparent', statusStyles[status])}>
            {t(`leaves.status.${status}`)}
        </Badge>
    );
}
