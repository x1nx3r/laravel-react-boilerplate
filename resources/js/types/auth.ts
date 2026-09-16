export type UserDocument = {
    id: number;
    user_id: string;
    original_name: string;
    stored_name: string;
    path: string;
    thumbnail_path?: string | null;
    thumbnail_url?: string | null;
    url: string;
    formatted_size: string;
    mime_type: string | null;
    size: number;
    category: string | null;
    created_at: string;
    updated_at: string;
};

export type User = {
    id: string; // ULID
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    is_active: boolean;
    status: 'pending' | 'active';
    roles?: { name: string }[]; // Spatie roles
    employee_id?: string | null;
    nik?: string | null;
    birth_place?: string | null;
    birth_date?: string | null;
    address?: string | null;
    employee_status?: 'kontrak' | 'tetap' | null;
    department?: string | null;
    gender?: 'L' | 'P' | null;
    join_date?: string | null;
    end_date?: string | null;
    major?: string | null;
    education_level?: 'sma' | 'smk' | 'd3' | 's1' | 's2' | 's3' | null;
    education_institution?: string | null;
    phone_number?: string | null;
    bank_account_number?: string | null;
    documents?: UserDocument[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    roles?: string[];
    permissions?: string[];
};
