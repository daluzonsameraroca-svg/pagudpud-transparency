<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('Profile/Show', [
            'user' => $request->user()->only([
                'name',
                'email',
                'phone_number',
                'address',
                'role',
                'created_at',
            ]),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $request->user()->update([
            'name' => trim($validated['name']),
            'phone_number' => filled($validated['phone_number'] ?? null)
                ? trim($validated['phone_number'])
                : null,
            'address' => filled($validated['address'] ?? null)
                ? trim($validated['address'])
                : null,
        ]);

        return back()->with('success', 'Profile updated successfully.');
    }
}
