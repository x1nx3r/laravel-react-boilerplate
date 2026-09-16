import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEventHandler } from 'react';

import { useTranslation } from 'react-i18next';
import AppLogoIcon from '@/components/app-shell/app-logo-icon';
import InputError from '@/components/common/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="w-full max-w-3xl space-y-6">
                <div className="flex flex-col items-center gap-2">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-md"
                    >
                        <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                    </Link>
                    <h1 className="text-xl font-medium">
                        {t('auth.register.title')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t('auth.register.subtitle')}
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Head title="Register" />

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        {t('auth.register.name')}
                                    </Label>
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
                                    <Label htmlFor="email">
                                        {t('auth.register.email')}
                                    </Label>
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
                                    <Label htmlFor="password">
                                        {t('auth.register.password')}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
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
                                    <Label htmlFor="password_confirmation">
                                        {t(
                                            'auth.register.password_confirmation',
                                        )}
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
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
                                        <Label htmlFor="employee_id">
                                            ID Karyawan
                                        </Label>
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
                                        <Label htmlFor="nik">
                                            {t('auth.register.nik')}
                                        </Label>
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
                                        <Label htmlFor="employee_status">
                                            Status Kontrak
                                        </Label>
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
                                                    Kontrak
                                                </SelectItem>
                                                <SelectItem value="tetap">
                                                    Tetap
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.employee_status}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="department">
                                            Departemen
                                        </Label>
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
                                        <Label htmlFor="join_date">
                                            Tanggal Bergabung
                                        </Label>
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
                                        <Label htmlFor="end_date">
                                            Tanggal Berakhir
                                        </Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
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
                                    Informasi Pribadi
                                </CardTitle>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="birth_place">
                                            Tempat Lahir
                                        </Label>
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
                                        <Label htmlFor="birth_date">
                                            Tanggal Lahir
                                        </Label>
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
                                        <Label htmlFor="gender">
                                            Jenis Kelamin
                                        </Label>
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
                                                    Laki-laki
                                                </SelectItem>
                                                <SelectItem value="P">
                                                    Perempuan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number">
                                            Nomor HP / WhatsApp
                                        </Label>
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
                                        <Label htmlFor="bank_account_number">
                                            Nomor Rekening
                                        </Label>
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
                                        <Label htmlFor="education_level">
                                            {t('auth.register.education_level')}
                                        </Label>
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
                                        <Label htmlFor="education_institution">
                                            Asal Pendidikan
                                        </Label>
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
                                        <Label htmlFor="major">
                                            {t('auth.register.major')}
                                        </Label>
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
                                        <Label htmlFor="address">
                                            Alamat Domisili
                                        </Label>
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
                                    {t('auth.register.documents_section')}
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
                                    Daftar
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
