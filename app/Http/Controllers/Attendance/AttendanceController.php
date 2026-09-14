<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('attendance/page', [
            'today' => $this->todayState($user),
            'calendar' => $this->calendar($user, $request->query('month')),
            'leaves' => $this->leavesPayload($user->leaveRequests()->with('reviewer')->latest('start_date')->get()),
        ]);
    }

    public function checkIn(Request $request): RedirectResponse
    {
        $user = $request->user();
        $today = today()->toDateString();

        if ($user->leaveRequests()->covering($today)->exists()) {
            return back()->with('error', __('app.attendance.on_leave'));
        }

        try {
            $user->attendances()->create([
                'date' => $today,
                'check_in_at' => now(),
            ]);
        } catch (UniqueConstraintViolationException) {
            return back()->with('error', __('app.attendance.already_checked_in'));
        }

        return back()->with('success', __('app.attendance.checked_in'));
    }

    public function checkOut(Request $request): RedirectResponse
    {
        $attendance = $request->user()->attendances()
            ->whereDate('date', today()->toDateString())
            ->first();

        if ($attendance === null) {
            return back()->with('error', __('app.attendance.not_checked_in'));
        }

        if ($attendance->check_out_at !== null) {
            return back()->with('error', __('app.attendance.already_checked_out'));
        }

        $attendance->update(['check_out_at' => now()]);

        return back()->with('success', __('app.attendance.checked_out'));
    }

    public function others(Request $request, User $user): Response
    {
        $history = $user->attendances()
            ->latest('date')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Attendance $attendance) => [
                'id' => $attendance->id,
                'date' => $attendance->date->format('Y-m-d'),
                'checkIn' => $attendance->check_in_at->format('H:i'),
                'checkOut' => $attendance->check_out_at?->format('H:i'),
            ]);

        return Inertia::render('attendance/others/page', [
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            'selectedUser' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'calendar' => $this->calendar($user, $request->query('month')),
            'history' => $history,
            'leaves' => $this->leavesPayload($user->leaveRequests()->with('reviewer')->latest('start_date')->get()),
        ]);
    }

    /**
     * Current-day state for the check-in/check-out card.
     */
    private function todayState(User $user): array
    {
        $attendance = $user->attendances()->whereDate('date', today()->toDateString())->first();

        return [
            'date' => today()->toDateString(),
            'onLeave' => $user->leaveRequests()->covering(today()->toDateString())->exists(),
            'checkIn' => $attendance?->check_in_at?->format('H:i'),
            'checkOut' => $attendance?->check_out_at?->format('H:i'),
        ];
    }

    /**
     * Per-day status map for one month (YYYY-MM via ?month=).
     *
     * Statuses: present, in_progress, leave, weekend, absent, upcoming.
     * Today without a record is left unmarked (the card carries the action).
     */
    private function calendar(User $user, ?string $monthParam): array
    {
        $now = now();
        $year = (int) $now->format('Y');
        $month = (int) $now->format('n');

        if ($monthParam !== null && preg_match('/^(\d{4})-(\d{2})$/', $monthParam, $matches)) {
            $candidateYear = (int) $matches[1];
            $candidateMonth = (int) $matches[2];

            if ($candidateMonth >= 1 && $candidateMonth <= 12) {
                $year = $candidateYear;
                $month = $candidateMonth;
            }
        }

        $monthStart = Carbon::create($year, $month, 1)->startOfDay();
        $monthEnd = $monthStart->copy()->endOfMonth();
        $today = $now->toDateString();

        $attendances = $user->attendances()
            ->forMonth($year, $month)
            ->get()
            ->keyBy(fn (Attendance $attendance) => $attendance->date->format('Y-m-d'));

        $leaveDates = [];
        foreach ($user->leaveRequests()->overlapping($monthStart->toDateString(), $monthEnd->toDateString())->get() as $leave) {
            foreach (Carbon::parse($leave->start_date)->toPeriod(Carbon::parse($leave->end_date)) as $date) {
                $leaveDates[$date->toDateString()] = true;
            }
        }

        $days = [];
        for ($date = $monthStart->copy(); $date <= $monthEnd; $date->addDay()) {
            $key = $date->toDateString();
            $attendance = $attendances->get($key);

            if ($attendance !== null) {
                $days[$key] = $attendance->check_out_at !== null ? 'present' : 'in_progress';
            } elseif (isset($leaveDates[$key])) {
                $days[$key] = 'leave';
            } elseif ($date->isWeekend()) {
                $days[$key] = 'weekend';
            } elseif ($key < $today) {
                $days[$key] = 'absent';
            } elseif ($key > $today) {
                $days[$key] = 'upcoming';
            }
        }

        return [
            'year' => $year,
            'month' => $month,
            'prev' => $monthStart->copy()->subMonth()->format('Y-m'),
            'next' => $monthStart->copy()->addMonth()->format('Y-m'),
            'days' => $days,
            'today' => $today,
        ];
    }

    private function leavesPayload($leaves): array
    {
        return $leaves
            ->map(fn (LeaveRequest $leave) => $leave->toPayload())
            ->all();
    }
}
