import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FieldLabelProps {
    htmlFor?: string;
    mark?: 'required' | 'optional';
    children: ReactNode;
    className?: string;
}

/**
 * Form label with a required marker (red asterisk) or an optional hint.
 */
export default function FieldLabel({
    htmlFor,
    mark = 'optional',
    children,
    className,
}: FieldLabelProps) {
    const { t } = useTranslation();

    return (
        <Label htmlFor={htmlFor} className={cn('gap-1', className)}>
            {children}
            {mark === 'required' ? (
                <span
                    aria-hidden="true"
                    title={t('common.required')}
                    className="text-destructive"
                >
                    *
                </span>
            ) : (
                <span className="text-xs font-normal text-muted-foreground">
                    ({t('common.optional')})
                </span>
            )}
        </Label>
    );
}
