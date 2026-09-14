<?php

use App\Http\Controllers\Admin\RegistrationSettingController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Attendance\LeaveRequestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard/page');
})->middleware(['auth'])->name('dashboard');

Route::middleware(['auth', 'permission:view_admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserController::class)->except(['show']);

        Route::put('users/{user}/verify', [UserController::class, 'verify'])
            ->name('users.verify');

        Route::post('users/{user}/documents', [UserController::class, 'storeDocument'])
            ->name('users.documents.store');
        Route::get('users/{user}/documents/{document}', [UserController::class, 'showDocument'])
            ->name('users.documents.show');
        Route::delete('users/{user}/documents/{document}', [UserController::class, 'destroyDocument'])
            ->name('users.documents.destroy');

        Route::resource('roles', RoleController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::put('settings/registration-approval', [RegistrationSettingController::class, 'update'])
            ->name('settings.registration-approval.update');
    });

Route::middleware(['auth'])->prefix('attendance')->name('attendance.')->group(function () {
    Route::get('/', [AttendanceController::class, 'index'])->name('index');
    Route::post('check-in', [AttendanceController::class, 'checkIn'])->name('check-in');
    Route::post('check-out', [AttendanceController::class, 'checkOut'])->name('check-out');

    Route::get('others/{user}', [AttendanceController::class, 'others'])
        ->middleware('permission:view_attendance')
        ->name('others');

    Route::get('leaves', [LeaveRequestController::class, 'index'])->name('leaves.index');
    Route::post('leaves', [LeaveRequestController::class, 'store'])->name('leaves.store');

    Route::get('leaves/review', [LeaveRequestController::class, 'reviewIndex'])
        ->middleware('permission:view_attendance')
        ->name('leaves.review');
    Route::put('leaves/{leave}/approve', [LeaveRequestController::class, 'approve'])
        ->middleware('permission:view_attendance')
        ->name('leaves.approve');
    Route::put('leaves/{leave}/reject', [LeaveRequestController::class, 'reject'])
        ->middleware('permission:view_attendance')
        ->name('leaves.reject');
});

require __DIR__.'/settings.php';
