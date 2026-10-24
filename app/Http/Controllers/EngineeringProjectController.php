<?php

namespace App\Http\Controllers;

use App\Events\ProjectProgressUpdated as ProjectProgressBroadcast;
use App\Models\Project;
use App\Notifications\CitizenUpdate;
use App\Notifications\ProjectProgressUpdated as ProjectProgressNotification;
use App\Services\CitizenNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use RuntimeException;
use Throwable;

class EngineeringProjectController extends Controller
{
    public function __construct(
        private readonly CitizenNotificationService $citizenNotifications,
    ) {}

    public function index()
    {
        $projects = Project::with([
            'progressUpdates' => fn ($query) => $query
                ->orderBy('update_date')
                ->orderBy('id'),
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('Engineering/Projects', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Engineering/CreateProject');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'implementing_office' => ['nullable', 'string', 'max:255'],
            'contractor' => ['nullable', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'budget' => ['required', 'numeric', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'target_completion_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],
            'status' => [
                'required',
                'in:Planned,Ongoing,Completed,Suspended',
            ],
            'progress' => [
                'required',
                'integer',
                'min:0',
                'max:100',
            ],
        ]);

        $this->validateStatusProgress(
            $validated['status'],
            (int) $validated['progress']
        );

        $imagePath = $request->file('image')->store('projects', 'public');

        if ($imagePath === false) {
            throw new RuntimeException('The project image could not be saved.');
        }

        unset($validated['image']);
        $validated['image_path'] = $imagePath;

        try {
            $project = DB::transaction(function () use ($validated) {
                $project = Project::create($validated);

                $project->progressUpdates()->create([
                    'status' => $project->status,
                    'progress' => $project->progress,
                    'update_description' => 'Project created and initial status recorded.',
                    'update_date' => $project->start_date ?? now()->toDateString(),
                ]);

                return $project;
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($imagePath);

            throw $exception;
        }

        $this->citizenNotifications->sendToCitizens(
            CitizenUpdate::projectCreated($project)
        );

        return redirect('/engineering/projects')
            ->with('success', 'Project created successfully.');
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:Planned,Ongoing,Completed,Suspended',
            ],
            'progress' => [
                'required',
                'integer',
                'min:0',
                'max:100',
            ],
            'update_description' => [
                'nullable',
                'string',
                'max:2000',
            ],
            'update_date' => [
                'required',
                'date',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'remove_image' => ['sometimes', 'boolean'],
        ]);

        $validated['progress'] = (int) $validated['progress'];
        $removeImage = (bool) ($validated['remove_image'] ?? false);
        unset($validated['image'], $validated['remove_image']);

        $this->validateStatusProgress(
            $validated['status'],
            $validated['progress']
        );

        $oldImagePath = null;
        $imagePath = null;
        $newImagePath = null;

        if ($request->hasFile('image')) {
            $newImagePath = $request->file('image')->store('projects', 'public');

            if ($newImagePath === false) {
                throw new RuntimeException('The project image could not be saved.');
            }

        }

        try {
            $updatedProject = DB::transaction(function () use (
                $project,
                $validated,
                $newImagePath,
                $removeImage,
                &$oldImagePath,
                &$imagePath
            ) {
                $lockedProject = Project::whereKey($project->id)
                    ->lockForUpdate()
                    ->firstOrFail();
                $oldImagePath = $lockedProject->image_path;
                $imagePath = $newImagePath
                    ?? ($removeImage ? null : $oldImagePath);

                $lockedProject->update([
                    'status' => $validated['status'],
                    'progress' => $validated['progress'],
                    'image_path' => $imagePath,
                ]);

                $lockedProject->progressUpdates()->create([
                    'status' => $validated['status'],
                    'progress' => $validated['progress'],
                    'update_description' => $validated['update_description'] ?? null,
                    'update_date' => $validated['update_date'],
                ]);

                return $lockedProject->fresh();
            });
        } catch (Throwable $exception) {
            if ($newImagePath !== null) {
                Storage::disk('public')->delete($newImagePath);
            }

            throw $exception;
        }

        if ($oldImagePath && $oldImagePath !== $imagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        $this->citizenNotifications->sendToCitizens(
            new ProjectProgressNotification($updatedProject)
        );

        broadcast(new ProjectProgressBroadcast($updatedProject));

        return back()->with(
            'success',
            'Project progress updated successfully.'
        );
    }

    private function validateStatusProgress(
        string $status,
        int $progress
    ): void {
        if ($status === 'Completed' && $progress !== 100) {
            throw ValidationException::withMessages([
                'progress' => 'A completed project must have 100% progress.',
            ]);
        }

        if ($progress === 100 && $status !== 'Completed') {
            throw ValidationException::withMessages([
                'status' => 'A project with 100% progress must have Completed status.',
            ]);
        }
    }
}
