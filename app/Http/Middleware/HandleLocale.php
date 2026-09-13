<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class HandleLocale
{
    public const COOKIE = 'locale';

    public const LOCALES = ['id', 'en'];

    /**
     * Resolve the active locale: cookie, then browser preference,
     * then the configured default.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie(self::COOKIE);

        if (! is_string($locale) || ! in_array($locale, self::LOCALES, true)) {
            $locale = $request->getPreferredLanguage(self::LOCALES)
                ?? config('app.locale');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
