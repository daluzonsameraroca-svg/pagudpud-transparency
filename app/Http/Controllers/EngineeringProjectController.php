<?php

namespace App\Http\Controllers;

use App\Events\ProjectProgressUpdated;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class EngineeringProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('created_at', 'desc')->get();

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
            'location' => ['required', 'string', 'max:255'],
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

        DB::transaction(function () use ($validated) {
            $project = Project::create($validated);

            $project->progressUpdates()->create([
                'status' => $project->status,
                'progress' => $project->progress,
                'update_description' =>
                    'Project created and initial status recorded.',
                'update_date' =>
                    $project->start_date ?? now()->toDateString(),
            ]);
        });

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
        ]);

        $validated['progress'] = (int) $validated['progress'];

        $this->validateStatusProgress(
            $validated['status'],
            $validated['progress']
        );

        $updatedProject = DB::transaction(function () use (
            $project,
            $validated
        ) {
            // Reload and lock the project during the update.
            $lockedProject = Project::whereKey($project->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Update the current project status and progress.
            $lockedProject->update([
                'status' => $validated['status'],
                'progress' => $validated['progress'],
            ]);

            // Record each submitted progress report, including
            // descriptions or dates when progress stays unchanged.
            $lockedProject->progressUpdates()->create([
                'status' => $validated['status'],
                'progress' => $validated['progress'],
                'update_description' =>
                    $validated['update_description'] ?? null,
                'update_date' => $validated['update_date'],
            ]);

            return $lockedProject->fresh();
        });

        // Broadcast only after the database transaction succeeds.
        $updatedProject->load([
    'progressUpdates' => function ($query) {
        $query->orderBy('update_date', 'asc')
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc');
    },
]);

broadcast(new ProjectProgressUpdated($updatedProject));
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
                'progress' =>
                    'A completed project must have 100% progress.',
            ]);
        }

        if ($progress === 100 && $status !== 'Completed') {
            throw ValidationException::withMessages([
                'status' =>
                    'A project with 100% progress must have Completed status.',
            ]);
        }
    }
}