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

    public function update(Request $request, Feedback $feedback)
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
            'remove_image' => ['sometimes', 'boolean'],
        ]);

        $removeImage = (bool) ($validated['remove_image'] ?? false);
        unset($validated['image'], $validated['remove_image']);

        $newImagePath = null;

        if ($request->hasFile('image')) {
            $newImagePath = $request->file('image')->store('feedback', 'public');

            if ($newImagePath === false) {
                throw new RuntimeException('The feedback image could not be saved.');
            }
        }

        try {
            [$oldImagePath, $updatedImagePath] = DB::transaction(function () use (
                $request,
                $feedback,
                $validated,
                $newImagePath,
                $removeImage,
            ) {
                $ownedFeedback = Feedback::query()
                    ->where('user_id', $request->user()->id)
                    ->whereKey($feedback->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $oldImagePath = $ownedFeedback->image_path;
                $updatedImagePath = $newImagePath
                    ?? ($removeImage ? null : $oldImagePath);

                $ownedFeedback->update([
                    'message' => trim($validated['message']),
                    'image_path' => $updatedImagePath,
                ]);

                return [$oldImagePath, $updatedImagePath];
            });
        } catch (Throwable $exception) {
            if ($newImagePath !== null) {
                Storage::disk('public')->delete($newImagePath);
            }

            throw $exception;
        }

        if ($oldImagePath !== null && $oldImagePath !== $updatedImagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return back()->with(
            'success',
            'Your feedback has been updated successfully.'
        );
    }

    public function destroy(Request $request, Feedback $feedback)
    {
        $imagePath = DB::transaction(function () use ($request, $feedback) {
            $ownedFeedback = Feedback::query()
                ->where('user_id', $request->user()->id)
                ->whereKey($feedback->id)
                ->lockForUpdate()
                ->firstOrFail();

            $imagePath = $ownedFeedback->image_path;
            $ownedFeedback->delete();

            return $imagePath;
        });

        if ($imagePath !== null) {
            Storage::disk('public')->delete($imagePath);
        }

        return back()->with(
            'success',
            'Your feedback has been deleted successfully.'
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
