<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    // Submit feedback about a project.
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'message' => [
                'required',
                'string',
                'min:5',
                'max:2000',
            ],
        ]);

        DB::transaction(function () use ($validated, $project) {
            Feedback::create([
                'user_id' => auth()->id(),
                'project_id' => $project->id,
                'message' => trim($validated['message']),
            ]);
        });

        return back()->with(
            'success',
            'Your feedback has been submitted successfully.'
        );
    }

    // Display feedback submitted by the logged-in citizen.
    public function myFeedback()
    {
        $feedback = Feedback::with('project')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return inertia('Citizen/Feedback', [
            'feedback' => $feedback,
        ]);
    }
}
