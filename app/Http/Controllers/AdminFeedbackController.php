<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class AdminFeedbackController extends Controller
{
    // Display all feedback submitted by citizens.
    public function index()
    {
        $feedback = Feedback::with(['user', 'project'])
            ->latest()
            ->get();

        return inertia('Admin/Feedback', [
            'feedback' => $feedback,
        ]);
    }

    // Update the status of citizen feedback.
    public function update(Request $request, Feedback $feedback)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:' . implode(',', Feedback::STATUSES),
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
