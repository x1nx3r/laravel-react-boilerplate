import type { LucideIcon } from 'lucide-react';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface StatCardProps {
    label: string;
    value: number | string;
    icon?: LucideIcon;
}

/**
 * One headline number with its label. Use in a `grid gap-4 sm:grid-cols-3`.
 */
export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                    {Icon && <Icon className="size-4 text-primary" />}
                    {label}
                </CardDescription>
                <CardTitle className="text-4xl tabular-nums">{value}</CardTitle>
            </CardHeader>
        </Card>
    );
}
