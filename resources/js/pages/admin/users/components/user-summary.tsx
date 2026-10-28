import type { LucideIcon } from 'lucide-react';
import { Briefcase, Building2, CalendarDays, Hash, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import type { User } from '@/types';

function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function MetaRow({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="truncate">{value}</dd>
            </div>
        </div>
    );
}

/**
 * Context rail for the employee record pages: identity and metadata.
 */
export function UserSummary({ user }: { user: User }) {
    const { t, i18n } = useTranslation();
    const roles = user.roles?.map((role) => role.name) ?? [];
    const employeeStatus = user.employee_status
        ? t(`users.form.${user.employee_status}`)
        : '—';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">
                    {t('users.summary.title')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
                        {initials(user.name)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate">{user.name}</p>
                        <p className="truncate text-sm text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {user.status === 'pending' ? (
                        <Badge variant="warning">
                            {t('users.badges.pending')}
                        </Badge>
                    ) : user.is_active ? (
                        <Badge variant="success">
                            {t('users.badges.active')}
                        </Badge>
                    ) : (
                        <Badge variant="secondary">
                            {t('users.badges.inactive')}
                        </Badge>
                    )}
                    {roles.length > 0 ? (
                        roles.map((role) => (
                            <Badge key={role} variant="outline">
                                {role}
                            </Badge>
                        ))
                    ) : (
                        <Badge variant="outline">
                            {t('users.table.no_role')}
                        </Badge>
                    )}
                </div>

                <Separator />

                <dl className="space-y-3 text-sm">
                    <MetaRow
                        icon={Hash}
                        label={t('users.form.employee_id')}
                        value={user.employee_id || '—'}
                    />
                    <MetaRow
                        icon={Building2}
                        label={t('users.form.department')}
                        value={user.department || '—'}
                    />
                    <MetaRow
                        icon={Briefcase}
                        label={t('users.form.employee_status')}
                        value={employeeStatus}
                    />
                    <MetaRow
                        icon={Phone}
                        label={t('users.form.phone_number')}
                        value={user.phone_number || '—'}
                    />
                    <MetaRow
                        icon={CalendarDays}
                        label={t('users.form.join_date')}
                        value={formatDate(
                            user.join_date,
                            i18n.language || 'en',
                        )}
                    />
                </dl>
            </CardContent>
        </Card>
    );
}
