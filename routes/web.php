<?php

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
        Route::resource('roles', RoleController::class)->only(['index', 'store', 'update', 'destroy']);
    });

require __DIR__.'/settings.php';
