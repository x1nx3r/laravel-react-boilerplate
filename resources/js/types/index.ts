export type * from './attendance';
export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginatedData<T> extends PaginationMeta {
    data: T[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: unknown;
        permissions: string[];
        roles: string[];
    };
    [key: string]: unknown;
};
