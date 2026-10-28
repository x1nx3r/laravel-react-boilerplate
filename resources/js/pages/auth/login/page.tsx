import { Form, Head } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InputError from '@/components/common/input-error';
import PasswordInput from '@/components/common/password-input';
import StatusMessage from '@/components/common/status-message';
import TextLink from '@/components/common/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthEnhancedSplitLayout from '@/layouts/auth/auth-enhanced-split-layout';

import { store } from '@/routes/login';

type Props = {
    status?: string;
    canRegister: boolean;
};

export default function Login({ status, canRegister }: Props) {
    const { t } = useTranslation();

    return (
        <AuthEnhancedSplitLayout
            title={t('auth.login.heading')}
            description={t('auth.login.description')}
        >
            <Head title={t('auth.login.title')} />

            {status && <StatusMessage message={status} type="info" autoHide />}

            <Form
                {...store()}
                resetOnSuccess={['password']}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        {errors.email && (
                            <StatusMessage
                                message={errors.email}
                                type="error"
                            />
                        )}

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('auth.login.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={t(
                                        'auth.login.email_placeholder',
                                    )}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t('auth.login.password')}
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={t(
                                        'auth.login.password_placeholder',
                                    )}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">
                                    {t('auth.login.remember')}
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        {t('common.processing')}
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        {t('auth.login.submit')}
                                    </>
                                )}
                            </Button>

                            {canRegister && (
                                <p className="text-center text-sm text-muted-foreground">
                                    {t('auth.login.no_account')}{' '}
                                    <TextLink href="/register" tabIndex={6}>
                                        {t('auth.login.register')}
                                    </TextLink>
                                </p>
                            )}
                        </div>
                    </>
                )}
            </Form>

            <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} ·{' '}
                    {t('common.all_rights_reserved')}
                </p>
            </div>
        </AuthEnhancedSplitLayout>
    );
}
