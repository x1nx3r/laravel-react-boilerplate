import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/common/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const { t } = useTranslation();
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({ password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(ProfileController.destroy().url, {
            preserveScroll: true,
            onError: () => passwordInput.current?.focus(),
            onSuccess: () => reset(),
        });
    };

    const handleCancel = () => {
        reset();
        clearErrors();
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-lg tracking-tight">
                    {t('settings.delete.title')}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {t('settings.delete.description')}
                </p>
            </div>
            <div className="space-y-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="relative space-y-0.5 text-destructive">
                    <p className="font-normal">
                        {t('settings.delete.warning')}
                    </p>
                    <p className="text-sm">
                        {t('settings.delete.warning_body')}
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            {t('settings.delete.submit')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            {t('settings.delete.confirm_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('settings.delete.confirm_body')}
                        </DialogDescription>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">
                                    {t('settings.delete.password')}
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder={t(
                                        'settings.delete.password_placeholder',
                                    )}
                                    autoComplete="current-password"
                                />

                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={handleCancel}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                </DialogClose>

                                <Button
                                    variant="destructive"
                                    disabled={processing}
                                    asChild
                                >
                                    <button
                                        type="submit"
                                        data-test="confirm-delete-user-button"
                                    >
                                        {t('settings.delete.submit')}
                                    </button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
