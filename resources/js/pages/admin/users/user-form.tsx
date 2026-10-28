import { Link, useForm, usePage } from '@inertiajs/react';
import { Loader2, Upload } from 'lucide-react';
import type { FormEventHandler } from 'react';

import { useTranslation } from 'react-i18next';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import FieldLabel from '@/components/common/field-label';
import InputError from '@/components/common/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { User } from '@/types';

interface UserFormProps {
    user?: User;
    roles: string[];
}

export function UserForm({ user, roles }: UserFormProps) {
    const isEdit = !!user;
    const isSelf = usePage().props.auth.user.id === user?.id;
    const { t } = useTranslation();

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        role: user?.roles?.[0]?.name ?? 'user',
        is_active: user?.is_active ?? true,
        employee_id: user?.employee_id ?? '',
        nik: user?.nik ?? '',
        birth_place: user?.birth_place ?? '',
        birth_date: user?.birth_date ?? '',
        address: user?.address ?? '',
        employee_status: user?.employee_status ?? '',
        department: user?.department ?? '',
        gender: user?.gender ?? '',
        join_date: user?.join_date ?? '',
        end_date: user?.end_date ?? '',
        major: user?.major ?? '',
        education_level: user?.education_level ?? '',
        education_institution: user?.education_institution ?? '',
        phone_number: user?.phone_number ?? '',
        bank_account_number: user?.bank_account_number ?? '',
        documents: [] as File[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit && user) {
            put(UserController.update({ user: user.id }).url);
        } else {
            post(UserController.store().url, { forceFormData: true });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('users.form.account_section')}</CardTitle>
                    <CardDescription>
                        {t('users.form.account_description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <FieldLabel htmlFor="name" mark="required">
                            {t('users.form.name')}
                        </FieldLabel>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="email" mark="required">
                            {t('users.form.email')}
                        </FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        {isEdit ? (
                            <Label htmlFor="password">
                                {t('users.form.password')}{' '}
                                <span className="text-muted-foreground">
                                    {t('users.form.password_keep')}
                                </span>
                            </Label>
                        ) : (
                            <FieldLabel htmlFor="password" mark="required">
                                {t('users.form.password')}
                            </FieldLabel>
                        )}
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required={!isEdit}
                            minLength={isEdit ? undefined : 8}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel
                            htmlFor="password_confirmation"
                            mark={isEdit ? 'optional' : 'required'}
                        >
                            {t('users.form.password_confirmation')}
                        </FieldLabel>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required={!!data.password}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="role" mark="required">
                            {t('users.form.role')}
                        </FieldLabel>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                            disabled={isSelf}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t(
                                        'users.form.role_placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', !!checked)
                            }
                            disabled={isSelf}
                        />
                        <Label htmlFor="is_active" className="font-normal">
                            {t('users.form.active')}
                        </Label>
                        <InputError message={errors.is_active} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('users.form.employee_section')}</CardTitle>
                    <CardDescription>
                        {t('users.form.employee_description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <FieldLabel htmlFor="employee_id">
                            {t('users.form.employee_id')}
                        </FieldLabel>
                        <Input
                            id="employee_id"
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            placeholder={t(
                                'users.form.employee_id_placeholder',
                            )}
                        />
                        <InputError message={errors.employee_id} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="nik">
                            {t('users.form.nik')}
                        </FieldLabel>
                        <Input
                            id="nik"
                            value={data.nik}
                            onChange={(e) => setData('nik', e.target.value)}
                            placeholder={t('users.form.nik_placeholder')}
                        />
                        <InputError message={errors.nik} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="employee_status">
                            {t('users.form.employee_status')}
                        </FieldLabel>
                        <Select
                            value={data.employee_status}
                            onValueChange={(value) =>
                                setData('employee_status', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t(
                                        'users.form.employee_status_placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kontrak">
                                    {t('users.form.kontrak')}
                                </SelectItem>
                                <SelectItem value="tetap">
                                    {t('users.form.tetap')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.employee_status} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="department">
                            {t('users.form.department')}
                        </FieldLabel>
                        <Input
                            id="department"
                            value={data.department}
                            onChange={(e) =>
                                setData('department', e.target.value)
                            }
                            placeholder={t('users.form.department_placeholder')}
                        />
                        <InputError message={errors.department} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="join_date">
                            {t('users.form.join_date')}
                        </FieldLabel>
                        <Input
                            id="join_date"
                            type="date"
                            value={data.join_date}
                            onChange={(e) =>
                                setData('join_date', e.target.value)
                            }
                        />
                        <InputError message={errors.join_date} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="end_date">
                            {t('users.form.end_date')}
                        </FieldLabel>
                        <Input
                            id="end_date"
                            type="date"
                            value={data.end_date}
                            min={data.join_date || undefined}
                            onChange={(e) =>
                                setData('end_date', e.target.value)
                            }
                        />
                        <InputError message={errors.end_date} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('users.form.personal_section')}</CardTitle>
                    <CardDescription>
                        {t('users.form.personal_description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <FieldLabel htmlFor="birth_place">
                            {t('users.form.birth_place')}
                        </FieldLabel>
                        <Input
                            id="birth_place"
                            value={data.birth_place}
                            onChange={(e) =>
                                setData('birth_place', e.target.value)
                            }
                        />
                        <InputError message={errors.birth_place} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="birth_date">
                            {t('users.form.birth_date')}
                        </FieldLabel>
                        <Input
                            id="birth_date"
                            type="date"
                            value={data.birth_date}
                            onChange={(e) =>
                                setData('birth_date', e.target.value)
                            }
                        />
                        <InputError message={errors.birth_date} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="gender">
                            {t('users.form.gender')}
                        </FieldLabel>
                        <Select
                            value={data.gender}
                            onValueChange={(value) => setData('gender', value)}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t(
                                        'users.form.gender_placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="L">
                                    {t('users.form.male')}
                                </SelectItem>
                                <SelectItem value="P">
                                    {t('users.form.female')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.gender} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="phone_number">
                            Nomor HP / WhatsApp
                        </FieldLabel>
                        <Input
                            id="phone_number"
                            value={data.phone_number}
                            onChange={(e) =>
                                setData('phone_number', e.target.value)
                            }
                            placeholder={t('users.form.phone_placeholder')}
                        />
                        <InputError message={errors.phone_number} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="bank_account_number">
                            Nomor Rekening
                        </FieldLabel>
                        <Input
                            id="bank_account_number"
                            value={data.bank_account_number}
                            onChange={(e) =>
                                setData('bank_account_number', e.target.value)
                            }
                        />
                        <InputError message={errors.bank_account_number} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="education_level">
                            {t('users.form.education_level')}
                        </FieldLabel>
                        <Select
                            value={data.education_level}
                            onValueChange={(value) =>
                                setData('education_level', value)
                            }
                        >
                            <SelectTrigger id="education_level">
                                <SelectValue
                                    placeholder={t(
                                        'users.form.education_level_placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {['sma', 'smk', 'd3', 's1', 's2', 's3'].map(
                                    (level) => (
                                        <SelectItem key={level} value={level}>
                                            {level.toUpperCase()}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.education_level} />
                    </div>

                    <div className="space-y-2">
                        <FieldLabel htmlFor="education_institution">
                            Asal Pendidikan
                        </FieldLabel>
                        <Input
                            id="education_institution"
                            value={data.education_institution}
                            onChange={(e) =>
                                setData('education_institution', e.target.value)
                            }
                        />
                        <InputError message={errors.education_institution} />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <FieldLabel htmlFor="major">
                            {t('users.form.major')}
                        </FieldLabel>
                        <Input
                            id="major"
                            value={data.major}
                            onChange={(e) => setData('major', e.target.value)}
                        />
                        <InputError message={errors.major} />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <FieldLabel htmlFor="address">
                            {t('users.form.address')}
                        </FieldLabel>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        <InputError message={errors.address} />
                    </div>
                </CardContent>
            </Card>

            {!isEdit && (
                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            {t('users.form.documents_section')}
                            <span className="text-xs font-normal text-muted-foreground">
                                ({t('common.optional')})
                            </span>
                        </CardTitle>
                        <CardDescription>
                            {t('users.form.documents_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            id="documents"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setData(
                                        'documents',
                                        Array.from(e.target.files),
                                    );
                                }
                            }}
                            className="cursor-pointer"
                        />
                        <InputError message={errors.documents} />
                        {data.documents.length > 0 && (
                            <p className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
                                {t('users.form.files_selected', {
                                    count: data.documents.length,
                                })}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {isSelf && (
                <p className="text-sm text-muted-foreground">
                    {t('users.form.self_note')}
                </p>
            )}

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" asChild>
                    <Link href={UserController.index().url}>
                        {t('common.cancel')}
                    </Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEdit
                        ? t('users.form.submit_edit')
                        : t('users.form.submit_create')}
                </Button>
            </div>
        </form>
    );
}
