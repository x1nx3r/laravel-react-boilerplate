export type User = {
    id: string; // ULID
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    is_active: boolean;
    roles?: { name: string }[]; // Spatie roles
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    roles?: string[];
    permissions?: string[];
};
