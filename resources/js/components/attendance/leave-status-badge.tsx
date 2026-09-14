import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LeaveStatus } from '@/types';

const statusStyles: Record<LeaveStatus, string> = {
    pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300',
    approved:
        'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-300',
    rejected:
        'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300',
};

export default function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
    const { t } = useTranslation();

    return (
        <Badge className={cn('border-transparent', statusStyles[status])}>
            {t(`leaves.status.${status}`)}
        </Badge>
    );
}
