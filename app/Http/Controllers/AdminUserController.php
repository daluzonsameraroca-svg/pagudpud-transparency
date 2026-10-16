<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
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

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => [
                'required',
                'string',
                Rule::in(['citizen', 'engineering', 'admin']),
            ],
        ]);

        DB::transaction(function () use ($request, $user, $validated) {
            $targetUser = User::whereKey($user->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Prevent administrators from changing their own role.
            if ($targetUser->id === $request->user()->id) {
                throw ValidationException::withMessages([
                    'role' => 'You cannot change your own administrator role.',
                ]);
            }

            // Prevent removing the last administrator.
            if (
                $targetUser->role === 'admin'
                && $validated['role'] !== 'admin'
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

            $targetUser->update([
                'role' => $validated['role'],
            ]);
        });

        return back()->with(
            'success',
            'User role updated successfully.'
        );
    }
}
