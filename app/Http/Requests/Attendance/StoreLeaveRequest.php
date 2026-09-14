<?php

namespace App\Http\Requests\Attendance;

use App\Models\LeaveRequest;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Any authenticated user may submit leave for themselves.
    }

    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date'],
            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
                function (string $attribute, mixed $value, Closure $fail) {
                    $overlap = LeaveRequest::where('user_id', $this->user()->id)
                        ->whereIn('status', [LeaveRequest::STATUS_PENDING, LeaveRequest::STATUS_APPROVED])
                        ->whereDate('start_date', '<=', $value)
                        ->whereDate('end_date', '>=', $this->input('start_date'))
                        ->exists();

                    if ($overlap) {
                        $fail(__('app.leaves.overlap'));
                    }
                },
            ],
            'reason' => ['required', 'string', 'max:2000'],
        ];
    }
}
