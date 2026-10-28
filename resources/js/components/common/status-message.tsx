import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatusMessageProps {
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
    autoHide?: boolean;
    duration?: number;
    onClose?: () => void;
}

export default function StatusMessage({
    message,
    type = 'error',
    autoHide = false,
    duration = 5000,
    onClose,
}: StatusMessageProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (autoHide && visible) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoHide, duration, onClose, visible]);

    if (!visible) return null;

    const variants = {
        error: {
            container:
                'border-destructive/20 bg-destructive/5 text-destructive',
            icon: XCircle,
        },
        success: {
            container: 'border-success/20 bg-success/5 text-success',
            icon: CheckCircle,
        },
        warning: {
            container: 'border-warning/20 bg-warning/5 text-warning',
            icon: AlertCircle,
        },
        info: {
            container: 'border-info/20 bg-info/5 text-info',
            icon: Info,
        },
    };

    const variant = variants[type];
    const Icon = variant.icon;

    return (
        <div
            className={cn(
                'mb-4 flex items-center gap-2 rounded-xl border p-4 text-sm transition-all duration-200',
                variant.container,
            )}
            role="alert"
        >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1">{message}</span>
        </div>
    );
}
