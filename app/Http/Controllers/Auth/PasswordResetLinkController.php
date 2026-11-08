<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('ForgotPassword', [
            'status' => $request->session()->get('status'),
        ]);
    }

    public function store(Request $request)
    {
        $request->merge([
            'email' => strtolower(trim((string) $request->input('email'))),
        ]);

        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        Password::sendResetLink($validated);

        return back()->with(
            'status',
            'If an account exists for that email address, we have sent a password reset link.',
        );
    }
}
