export type AttendanceDayStatus =
    | 'present'
    | 'in_progress'
    | 'leave'
    | 'weekend'
    | 'absent'
    | 'upcoming';

export type CalendarPayload = {
    year: number;
    month: number; // 1-12
    prev: string; // YYYY-MM
    next: string; // YYYY-MM
    days: Record<string, AttendanceDayStatus>;
    today: string; // Y-m-d
};

export type TodayState = {
    date: string; // Y-m-d
    onLeave: boolean;
    checkIn: string | null; // H:i
    checkOut: string | null; // H:i
};

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequestPayload = {
    id: string;
    userId: string;
    userName: string | null;
    startDate: string; // Y-m-d
    endDate: string; // Y-m-d
    reason: string;
    status: LeaveStatus;
    reviewerNote: string | null;
    reviewedAt: string | null;
    reviewerName: string | null;
};

export type AttendanceHistoryRow = {
    id: string;
    date: string; // Y-m-d
    checkIn: string; // H:i
    checkOut: string | null; // H:i
};

export type UserOption = {
    id: string;
    name: string;
    email: string;
};
