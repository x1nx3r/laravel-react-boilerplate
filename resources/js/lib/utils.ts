import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Format an ISO date (Y-m-d) for display in the active locale.
 * Returns an em dash for empty values.
 */
export function formatDate(
    value: string | null | undefined,
    locale: string,
    options?: Intl.DateTimeFormatOptions,
): string {
    if (!value) {
        return '—';
    }

    const [year, month, day] = value.slice(0, 10).split('-').map(Number);

    if (!year || !month || !day) {
        return value;
    }

    return new Intl.DateTimeFormat(
        locale || 'en',
        options ?? {
            dateStyle: 'medium',
        },
    ).format(new Date(year, month - 1, day));
}

/**
 * Duration between two H:i values as HH:MM. Returns an em dash when either
 * value is missing.
 */
export function formatDuration(
    checkIn: string | null | undefined,
    checkOut: string | null | undefined,
): string {
    if (!checkIn || !checkOut) {
        return '—';
    }

    const [inHour, inMinute] = checkIn.split(':').map(Number);
    const [outHour, outMinute] = checkOut.split(':').map(Number);

    let minutes = outHour * 60 + outMinute - (inHour * 60 + inMinute);

    if (minutes < 0) {
        minutes += 24 * 60;
    }

    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}
