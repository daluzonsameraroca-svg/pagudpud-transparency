<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class AdminFeedbackController extends Controller
{
    // Display all feedback submitted by citizens.
    public function index(Request $request)
    {
        $role = $request->user()->role;
        $feedback = Feedback::with('project')
            ->latest()
            ->get();

        $feedback
            ->where('is_anonymous', false)
            ->load([
                'user' => function ($query) use ($role) {
                    $columns = $role === 'engineering'
                        ? ['id', 'name']
                        : ['id', 'name', 'email'];

                    $query->select($columns);
                },
            ]);

        $feedback = $feedback->map(function (Feedback $entry): array {
            $attributes = $entry->toArray();

            if ($entry->is_anonymous) {
                unset($attributes['user_id']);
                $attributes['user'] = ['name' => 'Anonymous'];
            }

            return $attributes;
        });

        return inertia('Admin/Feedback', [
            'feedback' => $feedback,
            'role' => $role,
        ]);
    }

    // Update the status of citizen feedback.
    public function update(Request $request, Feedback $feedback)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:'.implode(',', Feedback::STATUSES),
            ],
        ]);

        $feedback->update([
            'status' => $validated['status'],
        ]);

        return back()->with(
            'success',
            'Feedback status updated successfully.'
        );
    }
}
