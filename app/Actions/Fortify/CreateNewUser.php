<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Concerns\SavesUserDocuments;
use App\Concerns\UserAttributeRules;
use App\Models\Setting;
use App\Models\User;
use App\Support\Rbac;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules, SavesUserDocuments, UserAttributeRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            ...$this->userAttributeRules(),
            ...$this->documentRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'status' => Setting::requireRegistrationApproval()
                ? User::STATUS_PENDING
                : User::STATUS_ACTIVE,
            ...$this->userAttributes($input),
        ]);

        $user->assignRole(Rbac::ROLE_USER);

        if (! empty($input['documents'])) {
            $this->saveUserDocuments($user, $input['documents']);
        }

        return $user;
    }
}
