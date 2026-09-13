import { Link, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEventHandler } from 'react';

import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
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
import type { User } from '@/types';

interface UserFormProps {
    user?: User;
    roles: string[];
}

export function UserForm({ user, roles }: UserFormProps) {
    const isEdit = !!user;
    const isSelf = usePage().props.auth.user.id === user?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        role: user?.roles?.[0]?.name ?? 'user',
        is_active: user?.is_active ?? true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit && user) {
            put(UserController.update({ user: user.id }).url);
        } else {
            post(UserController.store().url);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">
                        Password{' '}
                        {isEdit && (
                            <span className="text-muted-foreground">
                                (leave blank to keep)
                            </span>
                        )}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required={!isEdit}
                        minLength={isEdit ? undefined : 8}
                        autoComplete={isEdit ? 'new-password' : 'new-password'}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                        Confirm password
                    </Label>
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
                    {errors.password_confirmation && (
                        <p className="text-sm text-destructive">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                        value={data.role}
                        onValueChange={(value) => setData('role', value)}
                        disabled={isSelf}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.role && (
                        <p className="text-sm text-destructive">
                            {errors.role}
                        </p>
                    )}
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
                        Active (can log in)
                    </Label>
                    {errors.is_active && (
                        <p className="text-sm text-destructive">
                            {errors.is_active}
                        </p>
                    )}
                </div>
            </div>

            {isSelf && (
                <p className="text-sm text-muted-foreground">
                    You cannot change your own role or deactivate your own
                    account.
                </p>
            )}

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" asChild>
                    <Link href={UserController.index().url}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEdit ? 'Save changes' : 'Create user'}
                </Button>
            </div>
        </form>
    );
}
