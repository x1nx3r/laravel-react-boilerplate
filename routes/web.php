<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard/page');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/settings.php';
