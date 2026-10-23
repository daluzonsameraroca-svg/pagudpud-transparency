<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

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
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('feedback', 'public');

            if ($imagePath === false) {
                throw new RuntimeException('The feedback image could not be saved.');
            }
        }

        try {
            DB::transaction(function () use ($validated, $project, $imagePath) {
                Feedback::create([
                    'user_id' => auth()->id(),
                    'project_id' => $project->id,
                    'message' => trim($validated['message']),
                    'image_path' => $imagePath,
                ]);
            });
        } catch (Throwable $exception) {
            if ($imagePath !== null) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $exception;
        }

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
