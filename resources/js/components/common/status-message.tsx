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
                'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
            icon: XCircle,
        },
        success: {
            container:
                'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
            icon: CheckCircle,
        },
        warning: {
            container:
                'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
            icon: AlertCircle,
        },
        info: {
            container:
                'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
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
