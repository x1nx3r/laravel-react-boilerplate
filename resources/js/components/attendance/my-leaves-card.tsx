import { useTranslation } from 'react-i18next';
import LeavesTable from '@/components/attendance/leaves-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LeaveRequestPayload } from '@/types';

export default function MyLeavesCard({
    leaves,
}: {
    leaves: LeaveRequestPayload[];
}) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('leaves.my_leaves')}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <LeavesTable leaves={leaves} />
            </CardContent>
        </Card>
    );
}
