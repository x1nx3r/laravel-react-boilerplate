<?php

namespace App\Http\Requests\Admin;

use App\Concerns\UserAttributeRules;
use App\Support\Rbac;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    use UserAttributeRules;

    public function authorize(): bool
    {
        return true; // Authorization handled by policy in the controller.
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->route('user')?->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'is_active' => ['boolean'],
            ...$this->userAttributeRules(),
        ];

        if (! $this->user()->hasPermissionTo(Rbac::PERM_MANAGE_ROLES)) {
            $rules['role'] = array_merge($rules['role'], $this->assignableRoleRule());
        }

        return $rules;
    }
}
