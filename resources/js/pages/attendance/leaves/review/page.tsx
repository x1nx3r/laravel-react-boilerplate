import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeaveRequestController from '@/actions/App/Http/Controllers/Attendance/LeaveRequestController';
import Heading from '@/components/common/heading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, LeaveRequestPayload } from '@/types';

interface LeaveReviewProps {
    pending: LeaveRequestPayload[];
}

export default function LeaveReview({ pending }: LeaveReviewProps) {
    const { t } = useTranslation();
    const [rejecting, setRejecting] = useState<LeaveRequestPayload | null>(
        null,
    );
    const [note, setNote] = useState('');

    const approve = (leave: LeaveRequestPayload) => {
        router.put(
            LeaveRequestController.approve({ leave: leave.id }).url,
            {},
            { preserveScroll: true },
        );
    };

    const confirmReject = () => {
        if (!rejecting) return;
        router.put(
            LeaveRequestController.reject({ leave: rejecting.id }).url,
            { note },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejecting(null);
                    setNote('');
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attendance.breadcrumb'),
            href: '/attendance',
        },
        { title: t('leaves.review.breadcrumb'), href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('leaves.review.title')} />
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('leaves.review.title')}
                    description={t('leaves.review.description')}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>{t('leaves.review.queue_title')}</CardTitle>
                        <CardDescription>
                            {t('leaves.review.queue_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {t('leaves.review.user')}
                                    </TableHead>
                                    <TableHead>
                                        {t('leaves.table.dates')}
                                    </TableHead>
                                    <TableHead>
                                        {t('leaves.table.reason')}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t('common.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pending.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            {t('leaves.review.empty')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pending.map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {leave.userName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {leave.startDate} –{' '}
                                                {leave.endDate}
                                            </TableCell>
                                            <TableCell className="max-w-sm text-sm">
                                                {leave.reason}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            approve(leave)
                                                        }
                                                    >
                                                        {t(
                                                            'leaves.review.approve',
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            setNote('');
                                                            setRejecting(leave);
                                                        }}
                                                    >
                                                        {t(
                                                            'leaves.review.reject',
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={!!rejecting}
                onOpenChange={(open) => !open && setRejecting(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('leaves.review.reject_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('leaves.review.reject_description', {
                                name: rejecting?.userName,
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="reject-note">
                            {t('leaves.review.note')}
                        </Label>
                        <Textarea
                            id="reject-note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('common.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmReject}
                        >
                            {t('leaves.review.reject')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
