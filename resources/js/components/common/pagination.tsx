import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types';

interface PaginationProps {
    meta: PaginationMeta;
}

export function Pagination({ meta }: PaginationProps) {
    const { t } = useTranslation();

    if (meta.last_page === 1) return null;

    const { links } = meta;
    const prev = links[0];
    const next = links[links.length - 1];

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {t('pagination.showing', {
                    from: meta.from,
                    to: meta.to,
                    total: meta.total,
                })}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        disabled={!prev.url}
                        asChild={!!prev.url}
                    >
                        {prev.url ? (
                            <Link href={prev.url}>
                                <span className="sr-only">
                                    {t('pagination.first')}
                                </span>
                                <ChevronsLeft className="h-4 w-4" />
                            </Link>
                        ) : (
                            <span>
                                <ChevronsLeft className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={!prev.url}
                        asChild={!!prev.url}
                    >
                        {prev.url ? (
                            <Link href={prev.url}>
                                <span className="sr-only">
                                    {t('pagination.prev')}
                                </span>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        ) : (
                            <span>
                                <ChevronLeft className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                    <div className="w-[56px] text-center text-xs font-medium text-muted-foreground">
                        {meta.current_page}/{meta.last_page}
                    </div>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={!next.url}
                        asChild={!!next.url}
                    >
                        {next.url ? (
                            <Link href={next.url}>
                                <span className="sr-only">
                                    {t('pagination.next')}
                                </span>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <span>
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        disabled={!next.url}
                        asChild={!!next.url}
                    >
                        {next.url ? (
                            <Link href={next.url}>
                                <span className="sr-only">
                                    {t('pagination.last')}
                                </span>
                                <ChevronsRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <span>
                                <ChevronsRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
