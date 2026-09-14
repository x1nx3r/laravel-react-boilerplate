<?php

namespace Database\Seeders;

use App\Models\LeaveRequest;
use App\Models\User;
use App\Support\Rbac;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (array_unique(array_merge(...array_values(Rbac::rolePermissions()))) as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        foreach (Rbac::rolePermissions() as $roleName => $permissions) {
            Role::firstOrCreate(['name' => $roleName])
                ->syncPermissions($permissions);
        }

        $superadmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $superadmin->assignRole(Rbac::ROLE_SUPERADMIN);

        $hr = User::create([
            'name' => 'HR Staff',
            'email' => 'hr@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $hr->assignRole(Rbac::ROLE_HR);

        $regular = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $regular->assignRole(Rbac::ROLE_USER);

        // Demo activity: past-month attendance + leave requests so the
        // calendar and the HR review queue are populated. Seeded RNG keeps
        // screenshots reproducible.
        mt_srand(20260914);

        $this->seedLeaveRequests($regular, $hr);
        $this->seedAttendanceHistory($regular);
        $this->seedAttendanceHistory($hr);
        $this->seedAttendanceHistory($superadmin);
    }

    private function seedLeaveRequests(User $user, User $hr): void
    {
        $user->leaveRequests()->create([
            'start_date' => today()->subDays(16),
            'end_date' => today()->subDays(14),
            'reason' => 'Family matters in hometown.',
            'status' => LeaveRequest::STATUS_APPROVED,
            'reviewed_by' => $hr->id,
            'reviewed_at' => today()->subDays(20)->setTime(10, 30),
        ]);

        $user->leaveRequests()->create([
            'start_date' => today()->addDays(7),
            'end_date' => today()->addDays(8),
            'reason' => 'Wedding of a close relative.',
            'status' => LeaveRequest::STATUS_PENDING,
        ]);
    }

    private function seedAttendanceHistory(User $user): void
    {
        $leaveDates = [];
        foreach ($user->leaveRequests()->where('status', LeaveRequest::STATUS_APPROVED)->get() as $leave) {
            foreach (Carbon::parse($leave->start_date)->toPeriod(Carbon::parse($leave->end_date)) as $date) {
                $leaveDates[$date->toDateString()] = true;
            }
        }

        foreach (CarbonPeriod::create(today()->subDays(30), today()->subDay()) as $date) {
            if ($date->isWeekend() || isset($leaveDates[$date->toDateString()])) {
                continue;
            }

            // Occasional whole-day absence.
            if (mt_rand(1, 100) <= 8) {
                continue;
            }

            $checkIn = $date->copy()->setTime(7, 45)->addMinutes(mt_rand(0, 90));
            // A few forgotten check-outs stay open on purpose (honest data).
            $checkOut = mt_rand(1, 100) <= 7
                ? null
                : $checkIn->copy()->addHours(8)->addMinutes(mt_rand(0, 120));

            $user->attendances()->create([
                'date' => $date->toDateString(),
                'check_in_at' => $checkIn,
                'check_out_at' => $checkOut,
            ]);
        }
    }
}
