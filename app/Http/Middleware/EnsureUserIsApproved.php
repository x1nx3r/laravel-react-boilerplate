<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bounces any authenticated session whose account is pending
 * verification or deactivated — e.g. directly after registration
 * (Fortify logs the user in) or when HR deactivates an active session.
 */
class EnsureUserIsApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ($user->status === User::STATUS_PENDING || ! $user->is_active)) {
            $message = $user->status === User::STATUS_PENDING
                ? __('app.account.pending')
                : __('app.account.deactivated');

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('status', $message);
        }

        return $next($request);
    }
}
