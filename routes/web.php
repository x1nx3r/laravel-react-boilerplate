<?php

use App\Http\Controllers\Admin\RegistrationSettingController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
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

require __DIR__.'/settings.php';
