<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\StoreLeaveRequest;
use App\Models\LeaveRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $leaves = $request->user()->leaveRequests()
            ->with('reviewer')
            ->latest('start_date')
            ->get()
            ->map(fn (LeaveRequest $leave) => $leave->toPayload());

        return Inertia::render('attendance/leaves/page', [
            'leaves' => $leaves,
        ]);
    }

    public function store(StoreLeaveRequest $request): RedirectResponse
    {
        $request->user()->leaveRequests()->create([
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'status' => LeaveRequest::STATUS_PENDING,
        ]);

        return back()->with('success', __('app.leaves.submitted'));
    }

    public function reviewIndex(Request $request): Response
    {
        $pending = LeaveRequest::with('user')
            ->pending()
            ->latest()
            ->get()
            ->map(fn (LeaveRequest $leave) => $leave->toPayload());

        return Inertia::render('attendance/leaves/review/page', [
            'pending' => $pending,
        ]);
    }

    public function approve(Request $request, LeaveRequest $leave): RedirectResponse
    {
        return $this->review($request, $leave, LeaveRequest::STATUS_APPROVED);
    }

    public function reject(Request $request, LeaveRequest $leave): RedirectResponse
    {
        return $this->review($request, $leave, LeaveRequest::STATUS_REJECTED);
    }

    private function review(Request $request, LeaveRequest $leave, string $status): RedirectResponse
    {
        if ($leave->status !== LeaveRequest::STATUS_PENDING) {
            return back()->with('error', __('app.leaves.already_reviewed'));
        }

        $leave->update([
            'status' => $status,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'reviewer_note' => $request->input('note'),
        ]);

        return back()->with('success', __("app.leaves.{$status}"));
    }
}
