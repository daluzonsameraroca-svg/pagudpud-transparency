<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! auth()->check()) {
            return redirect('/login');
        }

        $userRole = strtolower(trim((string) $request->user()->role));
        $userRole = $userRole === 'administrator' ? 'admin' : $userRole;

        $allowedRoles = array_map(
            static fn (string $role): string => strtolower(trim($role)),
            $roles,
        );

        if (! in_array($userRole, $allowedRoles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
