import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEventHandler } from 'react';

import { useTranslation } from 'react-i18next';
import AppLogoIcon from '@/components/app-shell/app-logo-icon';
import FieldLabel from '@/components/common/field-label';
import InputError from '@/components/common/input-error';
import PasswordInput from '@/components/common/password-input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { store } from '@/routes/register';

export default function Register() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        employee_id: '',
        nik: '',
        birth_place: '',
        birth_date: '',
        address: '',
        employee_status: '',
        department: '',
        gender: '',
        join_date: '',
        end_date: '',
        major: '',
        education_level: '',
        education_institution: '',
        phone_number: '',
        bank_account_number: '',
        documents: [] as File[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(store().url, { forceFormData: true });
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-3xl space-y-6">
                <div className="flex flex-col items-center gap-2">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-md"
                    >
                        <AppLogoIcon className="size-9 fill-current text-foreground" />
                    </Link>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {t('auth.register.title')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t('auth.register.subtitle')}
                    </p>
                </div>

                <Card className="shadow-xs">
                    <CardContent className="pt-6">
                        <Head title="Register" />

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <FieldLabel htmlFor="name" mark="required">
                                        {t('auth.register.name')}
                                    </FieldLabel>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        required
                                        autoComplete="name"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <FieldLabel htmlFor="email" mark="required">
                                        {t('auth.register.email')}
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        required
                                        autoComplete="email"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <FieldLabel
                                        htmlFor="password"
                                        mark="required"
                                    >
                                        {t('auth.register.password')}
                                    </FieldLabel>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        required
                                        minLength={8}
                                        autoComplete="new-password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <FieldLabel
                                        htmlFor="password_confirmation"
                                        mark="required"
                                    >
                                        {t(
                                            'auth.register.password_confirmation',
                                        )}
                                    </FieldLabel>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        autoComplete="new-password"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                                <CardTitle className="text-base">
                                    {t('auth.register.employee_section')}
                                </CardTitle>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="employee_id">
                                            {t('auth.register.employee_id')}
                                        </FieldLabel>
                                        <Input
                                            id="employee_id"
                                            value={data.employee_id}
                                            onChange={(e) =>
                                                setData(
                                                    'employee_id',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                'auth.register.employee_id_placeholder',
                                            )}
                                        />
                                        <InputError
                                            message={errors.employee_id}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="nik">
                                            {t('auth.register.nik')}
                                        </FieldLabel>
                                        <Input
                                            id="nik"
                                            value={data.nik}
                                            onChange={(e) =>
                                                setData('nik', e.target.value)
                                            }
                                            placeholder={t(
                                                'auth.register.nik_placeholder',
                                            )}
                                        />
                                        <InputError message={errors.nik} />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="employee_status">
                                            {t('auth.register.employee_status')}
                                        </FieldLabel>
                                        <Select
                                            value={data.employee_status}
                                            onValueChange={(value) =>
                                                setData(
                                                    'employee_status',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'auth.register.employee_status_placeholder',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="kontrak">
                                                    {t('auth.register.kontrak')}
                                                </SelectItem>
                                                <SelectItem value="tetap">
                                                    {t('auth.register.tetap')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.employee_status}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="department">
                                            {t('auth.register.department')}
                                        </FieldLabel>
                                        <Input
                                            id="department"
                                            value={data.department}
                                            onChange={(e) =>
                                                setData(
                                                    'department',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                'auth.register.department_placeholder',
                                            )}
                                        />
                                        <InputError
                                            message={errors.department}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="join_date">
                                            {t('auth.register.join_date')}
                                        </FieldLabel>
                                        <Input
                                            id="join_date"
                                            type="date"
                                            value={data.join_date}
                                            onChange={(e) =>
                                                setData(
                                                    'join_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.join_date}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="end_date">
                                            {t('auth.register.end_date')}
                                        </FieldLabel>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            min={data.join_date || undefined}
                                            onChange={(e) =>
                                                setData(
                                                    'end_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.end_date} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                                <CardTitle className="text-base">
                                    {t('auth.register.personal_section')}
                                </CardTitle>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="birth_place">
                                            {t('auth.register.birth_place')}
                                        </FieldLabel>
                                        <Input
                                            id="birth_place"
                                            value={data.birth_place}
                                            onChange={(e) =>
                                                setData(
                                                    'birth_place',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.birth_place}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="birth_date">
                                            {t('auth.register.birth_date')}
                                        </FieldLabel>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={data.birth_date}
                                            onChange={(e) =>
                                                setData(
                                                    'birth_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.birth_date}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="gender">
                                            {t('auth.register.gender')}
                                        </FieldLabel>
                                        <Select
                                            value={data.gender}
                                            onValueChange={(value) =>
                                                setData('gender', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'auth.register.gender_placeholder',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="L">
                                                    {t('auth.register.male')}
                                                </SelectItem>
                                                <SelectItem value="P">
                                                    {t('auth.register.female')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="phone_number">
                                            {t('auth.register.phone_number')}
                                        </FieldLabel>
                                        <Input
                                            id="phone_number"
                                            value={data.phone_number}
                                            onChange={(e) =>
                                                setData(
                                                    'phone_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                'auth.register.phone_placeholder',
                                            )}
                                        />
                                        <InputError
                                            message={errors.phone_number}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="bank_account_number">
                                            {t(
                                                'auth.register.bank_account_number',
                                            )}
                                        </FieldLabel>
                                        <Input
                                            id="bank_account_number"
                                            value={data.bank_account_number}
                                            onChange={(e) =>
                                                setData(
                                                    'bank_account_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.bank_account_number}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="education_level">
                                            {t('auth.register.education_level')}
                                        </FieldLabel>
                                        <Select
                                            value={data.education_level}
                                            onValueChange={(value) =>
                                                setData(
                                                    'education_level',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger id="education_level">
                                                <SelectValue
                                                    placeholder={t(
                                                        'auth.register.education_level_placeholder',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    'sma',
                                                    'smk',
                                                    'd3',
                                                    's1',
                                                    's2',
                                                    's3',
                                                ].map((level) => (
                                                    <SelectItem
                                                        key={level}
                                                        value={level}
                                                    >
                                                        {level.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.education_level}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="education_institution">
                                            {t(
                                                'auth.register.education_institution',
                                            )}
                                        </FieldLabel>
                                        <Input
                                            id="education_institution"
                                            value={data.education_institution}
                                            onChange={(e) =>
                                                setData(
                                                    'education_institution',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors.education_institution
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <FieldLabel htmlFor="major">
                                            {t('auth.register.major')}
                                        </FieldLabel>
                                        <Input
                                            id="major"
                                            value={data.major}
                                            onChange={(e) =>
                                                setData('major', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.major} />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <FieldLabel htmlFor="address">
                                            {t('auth.register.address')}
                                        </FieldLabel>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border border-dashed p-4">
                                <CardTitle className="text-base">
                                    {t('auth.register.documents_section')}{' '}
                                    <span className="text-xs font-normal text-muted-foreground">
                                        ({t('common.optional')})
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    {t('auth.register.documents_description')}
                                </CardDescription>
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
                                        {t('auth.register.files_selected', {
                                            count: data.documents.length,
                                        })}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t('auth.register.submit')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    {t('auth.register.have_account')}{' '}
                    <Link
                        href="/login"
                        className="font-medium text-foreground underline"
                    >
                        {t('auth.register.login_link')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
