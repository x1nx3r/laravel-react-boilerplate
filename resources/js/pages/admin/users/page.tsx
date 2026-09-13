import { Head, router, usePage } from '@inertiajs/react';
import { Check, Pencil, Plus, Search, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';

import { Trans, useTranslation } from 'react-i18next';
import RegistrationSettingController from '@/actions/App/Http/Controllers/Admin/RegistrationSettingController';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { Pagination } from '@/components/common/pagination';
import StatusMessage from '@/components/common/status-message';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, User } from '@/types';

interface UsersIndexProps {
    users: PaginatedData<User>;
    roles: string[];
    departments: string[];
    requireRegistrationApproval: boolean;
    filters: {
        search?: string;
        role?: string;
        status?: string;
        is_active?: string;
        department?: string;
        employee_status?: string;
    };
}

export default function UsersIndex({
    users,
    roles,
    departments,
    requireRegistrationApproval,
    filters,
}: UsersIndexProps) {
    const { t } = useTranslation();
    const { auth, flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? 'all');
    const [approvalStatus, setApprovalStatus] = useState(
        filters.status ?? 'all',
    );
    const [accountStatus, setAccountStatus] = useState(
        filters.is_active ?? 'all',
    );
    const [department, setDepartment] = useState(filters.department ?? 'all');
    const [employeeStatus, setEmployeeStatus] = useState(
        filters.employee_status ?? 'all',
    );
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [requireApproval, setRequireApproval] = useState(
        requireRegistrationApproval,
    );

    const isSuperadmin = (auth.roles ?? []).includes('superadmin');

    const applyFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            UserController.index().url,
            {
                search: search || undefined,
                role: role === 'all' ? undefined : role,
                status: approvalStatus === 'all' ? undefined : approvalStatus,
                is_active: accountStatus === 'all' ? undefined : accountStatus,
                department: department === 'all' ? undefined : department,
                employee_status:
                    employeeStatus === 'all' ? undefined : employeeStatus,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setRole('all');
        setApprovalStatus('all');
        setAccountStatus('all');
        setDepartment('all');
        setEmployeeStatus('all');
        router.get(UserController.index().url, {}, { preserveState: true });
    };

    const toggleApproval = (value: boolean) => {
        setRequireApproval(value);
        router.put(
            RegistrationSettingController.update().url,
            { require_approval: value },
            { preserveState: true, preserveScroll: true },
        );
    };

    const canManage = (target: User) =>
        isSuperadmin || !target.roles?.some((r) => r.name === 'superadmin');

    const verifyUser = (target: User) => {
        router.put(UserController.verify({ user: target.id }).url, {
            preserveScroll: true,
        });
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(
                UserController.destroy({ user: userToDelete.id }).url,
                {
                    onSuccess: () => setUserToDelete(null),
                },
            );
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: t('users.breadcrumb'),
                    href: UserController.index().url,
                },
            ]}
        >
            <Head title={t('users.title')} />

            <div className="space-y-4">
                {flash.success && (
                    <StatusMessage
                        message={flash.success}
                        type="success"
                        autoHide
                    />
                )}
                {flash.error && (
                    <StatusMessage
                        message={flash.error}
                        type="error"
                        autoHide
                    />
                )}

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t('users.title')}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-md border p-2">
                            <Checkbox
                                id="require-approval"
                                checked={requireApproval}
                                onCheckedChange={(checked) =>
                                    toggleApproval(checked === true)
                                }
                            />
                            <Label
                                htmlFor="require-approval"
                                className="text-sm font-normal"
                            >
                                {t('users.require_approval')}
                            </Label>
                        </div>
                        <Button asChild>
                            <a href={UserController.create().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create user
                            </a>
                        </Button>
                    </div>
                </div>

                <form
                    onSubmit={applyFilters}
                    className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center"
                >
                    <div className="relative w-full md:w-56">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={t('users.search_placeholder')}
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="md:w-36">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('users.filters.role_all')}
                            </SelectItem>
                            {roles.map((r) => (
                                <SelectItem key={r} value={r}>
                                    {r}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={approvalStatus}
                        onValueChange={setApprovalStatus}
                    >
                        <SelectTrigger className="md:w-40">
                            <SelectValue placeholder="Approval" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('users.filters.approval_all')}
                            </SelectItem>
                            <SelectItem value="pending">
                                {t('users.filters.pending')}
                            </SelectItem>
                            <SelectItem value="active">
                                {t('users.filters.verified')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={accountStatus}
                        onValueChange={setAccountStatus}
                    >
                        <SelectTrigger className="md:w-36">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('users.filters.state_all')}
                            </SelectItem>
                            <SelectItem value="1">
                                {t('users.filters.active')}
                            </SelectItem>
                            <SelectItem value="0">
                                {t('users.filters.inactive')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger className="md:w-40">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('users.filters.department_all')}
                            </SelectItem>
                            {departments.map((d) => (
                                <SelectItem key={d} value={d}>
                                    {d}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={employeeStatus}
                        onValueChange={setEmployeeStatus}
                    >
                        <SelectTrigger className="md:w-36">
                            <SelectValue placeholder="Contract" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('users.filters.contract_all')}
                            </SelectItem>
                            <SelectItem value="kontrak">
                                {t('users.filters.kontrak')}
                            </SelectItem>
                            <SelectItem value="tetap">
                                {t('users.filters.tetap')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                        <Button type="submit" variant="outline">
                            Filter
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={clearFilters}
                            title={t('common.clear_filters')}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </form>

                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('users.table.name')}</TableHead>
                                <TableHead>
                                    {t('users.table.employee')}
                                </TableHead>
                                <TableHead>{t('users.table.roles')}</TableHead>
                                <TableHead>{t('users.table.state')}</TableHead>
                                <TableHead className="text-right">
                                    {t('users.table.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {t('users.no_results')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {user.employee_id ?? '—'}
                                            </div>
                                            <div className="text-xs text-muted-foreground capitalize">
                                                {user.department ?? '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles?.length ? (
                                                    user.roles.map((r) => (
                                                        <Badge
                                                            key={r.name}
                                                            variant="outline"
                                                            className="text-xs font-normal"
                                                        >
                                                            {r.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        No role
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap items-center gap-1">
                                                {user.status === 'pending' ? (
                                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300">
                                                        {t(
                                                            'users.badges.pending',
                                                        )}
                                                    </Badge>
                                                ) : user.is_active ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">
                                                        {t(
                                                            'users.badges.active',
                                                        )}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        {t(
                                                            'users.badges.inactive',
                                                        )}
                                                    </Badge>
                                                )}
                                                {user.status === 'pending' &&
                                                    canManage(user) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 px-2 text-xs"
                                                            onClick={() =>
                                                                verifyUser(user)
                                                            }
                                                            title="Verify and activate this account"
                                                        >
                                                            <Check className="mr-1 h-3 w-3" />
                                                            {t('users.verify')}
                                                        </Button>
                                                    )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    asChild={canManage(user)}
                                                    disabled={!canManage(user)}
                                                    title={
                                                        canManage(user)
                                                            ? t('common.edit')
                                                            : t(
                                                                  'users.edit_locked',
                                                              )
                                                    }
                                                >
                                                    {canManage(user) ? (
                                                        <a
                                                            href={
                                                                UserController.edit(
                                                                    {
                                                                        user: user.id,
                                                                    },
                                                                ).url
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </a>
                                                    ) : (
                                                        <Pencil className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    disabled={
                                                        auth.user.id ===
                                                            user.id ||
                                                        !canManage(user)
                                                    }
                                                    title={
                                                        auth.user.id === user.id
                                                            ? t(
                                                                  'users.delete_self',
                                                              )
                                                            : t('common.delete')
                                                    }
                                                    onClick={() =>
                                                        setUserToDelete(user)
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={users} />
            </div>

            <AlertDialog
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('users.delete_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <Trans
                                i18nKey="users.delete_description"
                                values={{ name: userToDelete?.name }}
                                components={{ strong: <strong /> }}
                            />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('common.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            {t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
