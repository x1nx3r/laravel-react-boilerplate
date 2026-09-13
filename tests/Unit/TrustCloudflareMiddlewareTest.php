<?php

namespace Tests\Unit;

use App\Http\Middleware\TrustCloudflare;
use Illuminate\Http\Request;
use Tests\TestCase;

class TrustCloudflareMiddlewareTest extends TestCase
{
    /**
     * Test that any immediate IP (catch-all) is trusted as a proxy and CF-Connecting-IP is resolved.
     */
    public function test_trusts_immediate_ip_and_resolves_cf_connecting_ip(): void
    {
        $middleware = new TrustCloudflare;

        // Simulate an immediate proxy IP
        $request = Request::create('/test-route', 'GET');
        $request->server->set('REMOTE_ADDR', '192.168.1.100');
        $request->headers->set('CF-Connecting-IP', '8.8.8.8');

        $middleware->handle($request, function ($req) {
            $this->assertEquals('8.8.8.8', $req->ip());
            $this->assertEquals('8.8.8.8', $req->server('REMOTE_ADDR'));
            $this->assertEquals('8.8.8.8', $req->header('X-Forwarded-For'));

            return response('OK');
        });
    }

    /**
     * Test that IPv6 immediate proxy and IPv6 client IP work correctly.
     */
    public function test_trusts_ipv6_immediate_ip_and_resolves_cf_connecting_ip(): void
    {
        $middleware = new TrustCloudflare;

        $request = Request::create('/test-route', 'GET');
        $request->server->set('REMOTE_ADDR', '2001:db8::1');
        $request->headers->set('CF-Connecting-IP', '2001:4860:4860::8888');

        $middleware->handle($request, function ($req) {
            $this->assertEquals('2001:4860:4860::8888', $req->ip());
            $this->assertEquals('2001:4860:4860::8888', $req->server('REMOTE_ADDR'));

            return response('OK');
        });
    }
}
