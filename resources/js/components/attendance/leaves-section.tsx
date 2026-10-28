import LeaveRequestForm from '@/components/attendance/leave-request-form';
import MyLeavesCard from '@/components/attendance/my-leaves-card';
import type { LeaveRequestPayload } from '@/types';

/**
 * Leave request form and the current user's requests, side by side.
 */
export default function LeavesSection({
    leaves,
}: {
    leaves: LeaveRequestPayload[];
}) {
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <LeaveRequestForm />
            <MyLeavesCard leaves={leaves} />
        </div>
    );
}
