import { Head, router, useForm } from '@inertiajs/react';
import {
    Loader2,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    X,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';

import { Trans, useTranslation } from 'react-i18next';
import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';
import { Pagination } from '@/components/common/pagination';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData } from '@/types';

interface Permission {
    id: number;
    name: string;
}

interface RoleWithCounts {
    id: number;
    name: string;
    permissions: Permission[];
    users_count: number;
}

interface RolesIndexProps {
    roles: PaginatedData<RoleWithCounts>;
    permissions: Permission[];
    filters: { search?: string };
}

function RoleFormDialog({
    role,
    availablePermissions,
    open,
    onClose,
}: {
    role?: RoleWithCounts | null;
    availablePermissions: Permission[];
    open: boolean;
    onClose: () => void;
}) {
    const isEdit = !!role;
    const isProtected = isEdit && role?.name === 'superadmin';
    const { t } = useTranslation();

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: role?.name ?? '',
        permissions: role?.permissions?.map((p) => p.name) ?? ([] as string[]),
    });

    const handlePermissionToggle = (
        permissionName: string,
        checked: boolean,
    ) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permissionName),
            );
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (isEdit && role) {
            put(RoleController.update({ role: role.id }).url, options);
        } else {
            post(RoleController.store().url, options);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                if (!o) {
                    reset();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit
                                ? t('roles.edit_dialog')
                                : t('roles.create_dialog')}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? t('roles.edit_description')
                                : t('roles.create_description')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role-name">{t('roles.name')}</Label>
                            <Input
                                id="role-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder={t('roles.name_placeholder')}
                                disabled={isProtected}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label>{t('roles.permissions')}</Label>
                            {errors.permissions && (
                                <p className="text-sm text-destructive">
                                    {errors.permissions}
                                </p>
                            )}

                            <div className="grid grid-cols-1 gap-6 rounded-md border bg-muted/20 p-4 md:grid-cols-2">
                                {availablePermissions.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-start space-x-2"
                                    >
                                        <Checkbox
                                            id={`perm-${p.id}`}
                                            checked={data.permissions.includes(
                                                p.name,
                                            )}
                                            onCheckedChange={(checked) =>
                                                handlePermissionToggle(
                                                    p.name,
                                                    !!checked,
                                                )
                                            }
                                            disabled={isProtected}
                                        />
                                        <Label
                                            htmlFor={`perm-${p.id}`}
                                            className="block cursor-pointer text-sm leading-none font-normal"
                                        >
                                            {p.name.replace(/_/g, ' ')}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || isProtected}
                        >
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEdit
                                ? t('common.save_changes')
                                : t('roles.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function RolesIndex({
    roles,
    permissions,
    filters,
}: RolesIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [editingRole, setEditingRole] = useState<RoleWithCounts | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<RoleWithCounts | null>(
        null,
    );
    const { t } = useTranslation();

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            RoleController.index().url,
            { search: search || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            router.delete(
                RoleController.destroy({ role: roleToDelete.id }).url,
                {
                    onSuccess: () => setRoleToDelete(null),
                },
            );
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: t('roles.breadcrumb'),
                    href: RoleController.index().url,
                },
            ]}
        >
            <Head title={t('roles.title')} />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {t('roles.title')}
                    </h1>
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('roles.create')}
                    </Button>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex w-full items-center space-x-2 md:w-auto"
                >
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={t('roles.search_placeholder')}
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                className="absolute top-2.5 right-2 text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                    setSearch('');
                                    router.get(
                                        RoleController.index().url,
                                        {},
                                        { preserveState: true },
                                    );
                                }}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" variant="outline">
                        {t('common.search_submit')}
                    </Button>
                </form>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">
                                    {t('roles.table.name')}
                                </TableHead>
                                <TableHead className="w-[45%]">
                                    {t('roles.permissions')}
                                </TableHead>
                                <TableHead className="text-center">
                                    {t('roles.table.users')}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t('common.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {t('roles.no_results')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.data.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="align-top font-medium">
                                            <div className="mt-1 flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                                                {role.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 align-top">
                                            {role.name === 'superadmin' ? (
                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                                    {t('roles.full_access')}
                                                </Badge>
                                            ) : (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {role.permissions.length >
                                                    0 ? (
                                                        role.permissions.map(
                                                            (p) => (
                                                                <Badge
                                                                    key={p.id}
                                                                    variant="outline"
                                                                    className="py-0 text-[10px] font-normal"
                                                                >
                                                                    {p.name.replace(
                                                                        /_/g,
                                                                        ' ',
                                                                    )}
                                                                </Badge>
                                                            ),
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            {t(
                                                                'roles.no_permissions',
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="pt-4 text-center align-top tabular-nums">
                                            {role.users_count}
                                        </TableCell>
                                        <TableCell className="pt-2 text-right align-top">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        setEditingRole(role)
                                                    }
                                                    title={
                                                        role.name ===
                                                        'superadmin'
                                                            ? t(
                                                                  'roles.immutable',
                                                              )
                                                            : t('common.edit')
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    disabled={
                                                        role.users_count > 0 ||
                                                        role.name ===
                                                            'superadmin'
                                                    }
                                                    title={
                                                        role.name ===
                                                        'superadmin'
                                                            ? t(
                                                                  'roles.immutable_delete',
                                                              )
                                                            : role.users_count >
                                                                0
                                                              ? t(
                                                                    'roles.in_use_delete',
                                                                )
                                                              : t(
                                                                    'common.delete',
                                                                )
                                                    }
                                                    onClick={() =>
                                                        setRoleToDelete(role)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination meta={roles} />
            </div>

            <RoleFormDialog
                open={isCreating}
                availablePermissions={permissions}
                onClose={() => setIsCreating(false)}
            />

            <RoleFormDialog
                key={editingRole?.id ?? 'none'}
                role={editingRole}
                availablePermissions={permissions}
                open={!!editingRole}
                onClose={() => setEditingRole(null)}
            />

            <AlertDialog
                open={!!roleToDelete}
                onOpenChange={(open) => !open && setRoleToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('roles.delete_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <Trans
                                i18nKey="roles.delete_description"
                                values={{ name: roleToDelete?.name }}
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
