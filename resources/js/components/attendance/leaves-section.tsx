import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import LeaveRequestController from '@/actions/App/Http/Controllers/Attendance/LeaveRequestController';
import LeavesTable from '@/components/attendance/leaves-table';
import InputError from '@/components/common/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LeaveRequestPayload } from '@/types';

export default function LeavesSection({
    leaves,
}: {
    leaves: LeaveRequestPayload[];
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        start_date: '',
        end_date: '',
        reason: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(LeaveRequestController.store().url, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t('leaves.form.title')}</CardTitle>
                    <CardDescription>
                        {t('leaves.form.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">
                                    {t('leaves.form.start_date')}
                                </Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.start_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">
                                    {t('leaves.form.end_date')}
                                </Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    min={data.start_date || undefined}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.end_date} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                {t('leaves.form.reason')}
                            </Label>
                            <Textarea
                                id="reason"
                                value={data.reason}
                                onChange={(e) =>
                                    setData('reason', e.target.value)
                                }
                                placeholder={t('leaves.form.reason_placeholder')}
                                rows={3}
                                required
                            />
                            <InputError message={errors.reason} />
                        </div>
                        <Button type="submit" disabled={processing}>
                            {t('leaves.form.submit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('leaves.my_leaves')}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <LeavesTable leaves={leaves} />
                </CardContent>
            </Card>
        </div>
    );
}
