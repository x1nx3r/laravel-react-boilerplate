<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Rbac;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $employeeStats = $request->user()->hasPermissionTo(Rbac::PERM_VIEW_ADMIN)
            ? $this->employeeStats()
            : null;

        return Inertia::render('dashboard/page', [
            'employeeStats' => $employeeStats,
        ]);
    }

    /**
     * Aggregates for the employee dashboard charts.
     */
    private function employeeStats(): array
    {
        $gender = User::query()
            ->selectRaw('gender, count(*) as total')
            ->whereNotNull('gender')
            ->groupBy('gender')
            ->pluck('total', 'gender');

        $education = User::query()
            ->selectRaw('education_level, count(*) as total')
            ->whereNotNull('education_level')
            ->groupBy('education_level')
            ->pluck('total', 'education_level');

        $ageBins = ['<25' => 0, '25-34' => 0, '35-44' => 0, '45-54' => 0, '55+' => 0];
        foreach (User::whereNotNull('birth_date')->pluck('birth_date') as $birthDate) {
            $bin = match (true) {
                $birthDate->age < 25 => '<25',
                $birthDate->age < 35 => '25-34',
                $birthDate->age < 45 => '35-44',
                $birthDate->age < 55 => '45-54',
                default => '55+',
            };
            $ageBins[$bin]++;
        }

        return [
            'total' => User::count(),
            'gender' => [
                ['label' => 'L', 'total' => (int) $gender->get('L', 0)],
                ['label' => 'P', 'total' => (int) $gender->get('P', 0)],
            ],
            'education' => collect(['sma', 'smk', 'd3', 's1', 's2', 's3'])
                ->map(fn (string $level) => [
                    'label' => strtoupper($level),
                    'total' => (int) $education->get($level, 0),
                ])
                ->values()
                ->all(),
            'ages' => collect($ageBins)
                ->map(fn (int $total, string $bin) => ['label' => $bin, 'total' => $total])
                ->values()
                ->all(),
        ];
    }
}
