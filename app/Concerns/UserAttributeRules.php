<?php

namespace App\Concerns;

use App\Support\Rbac;
use Illuminate\Validation\Rule;

trait UserAttributeRules
{
    /**
     * Validation rules for the optional HR profile attributes.
     *
     * @return array<string, array<int, mixed>>
     */
    protected function userAttributeRules(): array
    {
        return [
            'employee_id' => ['nullable', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:255'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'employee_status' => ['nullable', 'string', 'in:kontrak,tetap'],
            'department' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'in:L,P'],
            'join_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:join_date'],
            'major' => ['nullable', 'string', 'max:255'],
            'education_level' => ['nullable', 'string', 'in:sma,smk,d3,s1,s2,s3'],
            'education_institution' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'bank_account_number' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Extract the HR attributes from an input array, null-safe.
     *
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    protected function userAttributes(array $input): array
    {
        return [
            'employee_id' => $input['employee_id'] ?? null,
            'nik' => $input['nik'] ?? null,
            'birth_place' => $input['birth_place'] ?? null,
            'birth_date' => $input['birth_date'] ?? null,
            'address' => $input['address'] ?? null,
            'employee_status' => $input['employee_status'] ?? null,
            'department' => $input['department'] ?? null,
            'gender' => $input['gender'] ?? null,
            'join_date' => $input['join_date'] ?? null,
            'end_date' => $input['end_date'] ?? null,
            'major' => $input['major'] ?? null,
            'education_level' => $input['education_level'] ?? null,
            'education_institution' => $input['education_institution'] ?? null,
            'phone_number' => $input['phone_number'] ?? null,
            'bank_account_number' => $input['bank_account_number'] ?? null,
        ];
    }

    /**
     * Validation rules for document uploads.
     *
     * @return array<string, array<int, mixed>>
     */
    protected function documentRules(): array
    {
        return [
            'documents' => ['nullable', 'array'],
            'documents.*' => ['file', 'max:10240'], // 10 MB per file
        ];
    }

    /**
     * Rule ensuring a role exists; actors without manage_roles
     * may never assign the superadmin role.
     *
     * @return array<int, mixed>
     */
    protected function assignableRoleRule(): array
    {
        return [Rule::notIn([Rbac::ROLE_SUPERADMIN])];
    }
}
