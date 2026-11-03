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
        $feedback = Feedback::with([
            'project',
            'user' => function ($query) use ($role) {
                if ($role === 'engineering') {
                    $query->select('id', 'name');
                }
            },
        ])
            ->latest()
            ->get();

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
