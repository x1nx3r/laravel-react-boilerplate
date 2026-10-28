import { Head, Link } from '@inertiajs/react';
import {
    ShieldAlert,
    FileQuestion,
    ServerCrash,
    Construction,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function ErrorPage({ status }: { status: number }) {
    const { t } = useTranslation();

    const title = t(`errors.${status}.title`, {
        defaultValue: t('errors.generic.title'),
    });

    const description = t(`errors.${status}.description`, {
        defaultValue: t('errors.generic.description'),
    });

    const Icon =
        {
            503: Construction,
            500: ServerCrash,
            404: FileQuestion,
            403: ShieldAlert,
        }[status] || ServerCrash;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
            <Head title={title} />

            <div className="flex max-w-md flex-col items-center space-y-6 text-center">
                <div className="rounded-full bg-muted p-6">
                    <Icon className="h-16 w-16 text-primary" />
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {title}
                </h1>

                <p className="text-lg text-muted-foreground">{description}</p>

                <div className="flex gap-4">
                    <Button asChild size="lg">
                        <Link href="/">{t('errors.back_home')}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
