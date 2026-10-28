import type { ReactNode } from 'react';

interface SuccessMessageProps {
    show: boolean;
    children: ReactNode;
}

export default function SuccessMessage({
    show,
    children,
}: SuccessMessageProps) {
    return (
        <p aria-live="polite" className="text-sm text-muted-foreground">
            {show ? (
                <span className="inline-block animate-in duration-200 fade-in">
                    {children}
                </span>
            ) : null}
        </p>
    );
}
