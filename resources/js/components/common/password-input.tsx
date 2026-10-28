import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    name: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ id, name, className, ...props }, ref) => {
        const { t } = useTranslation();
        const [showPassword, setShowPassword] = useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword((prev) => !prev);
        };

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    id={id}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    className={cn('pr-10', className)}
                    {...props}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    aria-label={
                        showPassword
                            ? t('common.hide_password')
                            : t('common.show_password')
                    }
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff
                            className="h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                    ) : (
                        <Eye
                            className="h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                    )}
                </Button>
            </div>
        );
    },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
