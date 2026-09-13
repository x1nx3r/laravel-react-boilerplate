import { usePage, router } from '@inertiajs/react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const LOCALE_COOKIE = 'locale';
const LOCALES = ['id', 'en'];

/**
 * Read the active locale (shared by the backend) and switch it:
 * persists the cookie the backend middleware reads, updates the
 * client i18n instance, then reloads shared props.
 */
export function useLocale(): [string, (locale: string) => void] {
    const { i18n: current } = useTranslation();
    const locale = usePage().props.locale ?? current.language;

    const setLocale = useCallback(
        (next: string) => {
            if (!LOCALES.includes(next) || next === locale) {
                return;
            }

            document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

            void i18n.changeLanguage(next);

            router.reload();
        },
        [locale],
    );

    return [locale, setLocale];
}
