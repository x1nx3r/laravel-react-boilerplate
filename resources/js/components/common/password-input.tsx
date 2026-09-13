import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    name: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ id, name, className, ...props }, ref) => {
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
                    className={className}
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
                            ? 'Sembunyikan kata sandi'
                            : 'Tampilkan kata sandi'
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
