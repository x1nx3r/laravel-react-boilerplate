import * as React from 'react';

type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: React.ReactNode;
};

/**
 * Standard page header: title and description on the left, actions on
 * the right. Every page in the app shell starts with one.
 */
export default function PageHeader({
    title,
    description,
    actions,
}: PageHeaderProps) {
    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl tracking-tight">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-3">
                    {actions}
                </div>
            )}
        </header>
    );
}
