<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'phone_number' => ['required', 'string', 'max:20'],
            'barangay' => ['required', 'string', 'max:100'],
            'sitio' => ['required', 'string', 'max:150'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8),
            ],
        ]);

        $user = User::create([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'phone_number' => trim($validated['phone_number']),
            'address' => sprintf(
                '%s, %s, Pagudpud, Ilocos Norte',
                trim($validated['sitio']),
                trim($validated['barangay']),
            ),
            'role' => 'citizen',
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/citizen/dashboard')
            ->with('new_citizen', true);
    }
}
