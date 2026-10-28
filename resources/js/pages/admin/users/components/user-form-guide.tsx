import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Context rail for the create-employee form: what each section expects.
 */
export function UserFormGuide() {
    const { t } = useTranslation();

    const items = [
        {
            title: t('users.guide.account_title'),
            body: t('users.guide.account'),
        },
        {
            title: t('users.guide.employment_title'),
            body: t('users.guide.employment'),
        },
        {
            title: t('users.guide.personal_title'),
            body: t('users.guide.personal'),
        },
        {
            title: t('users.guide.documents_title'),
            body: t('users.guide.documents'),
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">
                    {t('users.guide.title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="space-y-4 text-sm">
                    {items.map((item) => (
                        <div key={item.title} className="space-y-1">
                            <dt className="font-normal">{item.title}</dt>
                            <dd className="text-muted-foreground">
                                {item.body}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );
}
