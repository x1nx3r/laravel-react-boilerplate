<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class TrustCloudflare
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->server('REMOTE_ADDR');

        if ($ip) {
            // Trust the immediate connecting proxy. Firewall must restrict access to only trusted IPs.
            $currentTrusted = Request::getTrustedProxies() ?: [];
            Request::setTrustedProxies(
                array_unique(array_merge($currentTrusted, [$ip])),
                Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO
            );

            // The preview proxy forwards HTTPS through an HTTP hop. Make
            // the URL generator follow the browser's scheme even when PHP's
            // request object sees a plain socket.
            $forwardedProto = strtolower((string) $request->headers->get('X-Forwarded-Proto', ''));
            if (str_contains($forwardedProto, 'https')) {
                URL::forceScheme('https');
            }

            // Look at the CF-Connecting-IP header to find the real user.
            if ($request->headers->has('CF-Connecting-IP')) {
                $realIp = $request->header('CF-Connecting-IP');

                // Normalize IP array if a list is somehow provided
                if (str_contains($realIp, ',')) {
                    $ips = array_map('trim', explode(',', $realIp));
                    $realIp = end($ips);
                }

                if (filter_var($realIp, FILTER_VALIDATE_IP)) {
                    // Update REMOTE_ADDR and X-Forwarded-For so the rest of the application
                    // correctly sees the client's original IP.
                    $request->server->set('REMOTE_ADDR', $realIp);
                    $request->headers->set('X-Forwarded-For', $realIp);
                }
            }
        }

        return $next($request);
    }
}
