<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => 'The provided email or password is incorrect.',
            ]);
        }

        $request->session()->regenerate();

        $role = strtolower(trim((string) $request->user()->role));

        return match ($role) {
            'citizen' => redirect('/citizen/dashboard'),
            'engineering' => redirect('/engineering/dashboard'),
            'admin', 'administrator' => redirect('/admin/dashboard'),
            default => $this->logoutInvalidRole($request),
        };
    }

    private function logoutInvalidRole(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->withErrors([
            'email' => 'Your account does not have a valid assigned role.',
        ]);
    }
}
