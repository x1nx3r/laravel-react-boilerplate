import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import Heading from '@/components/common/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type ChartDatum = { label: string; total: number };

interface EmployeeStats {
    total: number;
    gender: ChartDatum[];
    education: ChartDatum[];
    ages: ChartDatum[];
}

interface DashboardProps {
    employeeStats: EmployeeStats;
}

const tooltipStyle = {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 12,
};

function StatsBarChart({ data }: { data: ChartDatum[] }) {
    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                    />
                    <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        width={32}
                        fontSize={12}
                    />
                    <Tooltip
                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                        contentStyle={tooltipStyle}
                    />
                    <Bar
                        dataKey="total"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={48}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function Dashboard({ employeeStats }: DashboardProps) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.title'), href: '/' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('dashboard.stats.title')}
                    description={t('dashboard.stats.description')}
                />

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <Users className="size-4 text-primary" />
                                    {t('dashboard.stats.total_employees')}
                                </CardDescription>
                                <CardTitle className="text-4xl tabular-nums">
                                    {employeeStats.total}
                                </CardTitle>
                            </CardHeader>
                        </Card>

                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {t('dashboard.stats.gender_title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('dashboard.stats.gender_description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <StatsBarChart
                                        data={employeeStats.gender.map(
                                            (d) => ({
                                                ...d,
                                                label: t(
                                                    `dashboard.stats.gender.${d.label}`,
                                                ),
                                            }),
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {t('dashboard.stats.education_title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            'dashboard.stats.education_description',
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <StatsBarChart
                                        data={employeeStats.education}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {t('dashboard.stats.age_title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('dashboard.stats.age_description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <StatsBarChart data={employeeStats.ages} />
                                </CardContent>
                            </Card>
                        </div>
            </div>
        </AppLayout>
    );
}
