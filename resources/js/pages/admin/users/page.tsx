import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';

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
import { Input } from '@/components/ui/input';
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
    filters: {
        search?: string;
        role?: string;
        is_active?: string;
    };
}

export default function UsersIndex({ users, roles, filters }: UsersIndexProps) {
    const { auth, flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? 'all');
    const [status, setStatus] = useState(filters.is_active ?? 'all');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const isSuperadmin = (auth.roles ?? []).includes('superadmin');

    const applyFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            UserController.index().url,
            {
                search: search || undefined,
                role: role === 'all' ? undefined : role,
                is_active: status === 'all' ? undefined : status,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setRole('all');
        setStatus('all');
        router.get(UserController.index().url, {}, { preserveState: true });
    };

    const canManage = (target: User) =>
        isSuperadmin || !target.roles?.some((r) => r.name === 'superadmin');

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
            breadcrumbs={[{ title: 'Users', href: UserController.index().url }]}
        >
            <Head title="User management" />

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

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <Button asChild>
                        <a href={UserController.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create user
                        </a>
                    </Button>
                </div>

                <form
                    onSubmit={applyFilters}
                    className="flex flex-col gap-2 md:flex-row md:items-center"
                >
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search name or email..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="md:w-44">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            {roles.map((r) => (
                                <SelectItem key={r} value={r}>
                                    {r}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="md:w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
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
                            title="Clear filters"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </form>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No users found.
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
                                            {user.is_active ? (
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Inactive
                                                </Badge>
                                            )}
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
                                                            ? 'Edit'
                                                            : 'Only superadmins can edit superadmin accounts'
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
                                                            ? 'You cannot delete your own account'
                                                            : 'Delete'
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
                        <AlertDialogTitle>Delete user</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{userToDelete?.name}</strong>? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
