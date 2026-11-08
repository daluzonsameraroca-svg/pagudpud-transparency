<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get();

        return inertia('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $email = $request->input('email');

        if (is_string($email)) {
            $request->merge([
                'email' => strtolower(trim($email)),
            ]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8),
            ],
            'engineering_permission' => [
                'required',
                'string',
                Rule::in(['viewer', 'editor']),
            ],
        ]);

        User::create([
            'name' => trim($validated['name']),
            'email' => $validated['email'],
            'role' => 'engineering',
            'engineering_permission' => $validated['engineering_permission'],
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with(
            'success',
            'Engineering account created successfully.',
        );
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['citizen', 'engineering', 'admin']),
            ],
            'engineering_permission' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['viewer', 'editor']),
            ],
        ]);

        if ($validated === []) {
            throw ValidationException::withMessages([
                'role' => 'Select a user role or engineering permission.',
            ]);
        }

        DB::transaction(function () use ($request, $user, $validated) {
            $targetUser = User::whereKey($user->id)
                ->lockForUpdate()
                ->firstOrFail();
            $role = $validated['role'] ?? $targetUser->role;

            if (
                isset($validated['engineering_permission'])
                && $role !== 'engineering'
            ) {
                throw ValidationException::withMessages([
                    'engineering_permission' => 'Only Engineering users can be assigned project permissions.',
                ]);
            }

            if (
                isset($validated['role'])
                && $targetUser->id === $request->user()->id
            ) {
                throw ValidationException::withMessages([
                    'role' => 'You cannot change your own administrator role.',
                ]);
            }

            if (
                $targetUser->role === 'admin'
                && isset($validated['role'])
                && $role !== 'admin'
            ) {
                $adminCount = User::where('role', 'admin')
                    ->lockForUpdate()
                    ->count();

                if ($adminCount <= 1) {
                    throw ValidationException::withMessages([
                        'role' => 'The last administrator cannot be demoted.',
                    ]);
                }
            }

            $attributes = [];

            if (isset($validated['role'])) {
                $attributes['role'] = $role;

                if ($role !== $targetUser->role) {
                    $attributes['engineering_permission'] = 'viewer';
                }
            }

            if (isset($validated['engineering_permission'])) {
                $attributes['engineering_permission'] = $validated['engineering_permission'];
            }

            $targetUser->update($attributes);
        });

        $message = isset($validated['engineering_permission'])
            ? 'Engineering project permission updated successfully.'
            : 'User role updated successfully.';

        return back()->with('success', $message);
    }
}
