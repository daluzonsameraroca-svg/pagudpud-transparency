<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Notifications\CitizenUpdate;
use App\Services\CitizenNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminProjectController extends Controller
{
    public function __construct(
        private readonly CitizenNotificationService $citizenNotifications,
    ) {}

    public function index()
    {
        $projects = Project::latest()->get();

        return inertia('Admin/Projects', [
            'projects' => $projects,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'project_name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'implementing_office' => [
                'nullable',
                'string',
                'max:255',
            ],

            'contractor' => [
                'nullable',
                'string',
                'max:255',
            ],

            'location' => [
                'required',
                'string',
                'max:255',
            ],

            'latitude' => [
                'nullable',
                'required_with:longitude',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'nullable',
                'required_with:latitude',
                'numeric',
                'between:-180,180',
            ],

            'budget' => [
                'required',
                'numeric',
                'min:0',
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

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

        $project->update([
            'project_name' => $validated['project_name'],
            'description' => $validated['description'] ?? null,
            'implementing_office' => $validated['implementing_office'] ?? null,
            'contractor' => $validated['contractor'] ?? null,
            'location' => $validated['location'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'budget' => $validated['budget'],
            'start_date' => $validated['start_date'] ?? null,
            'target_completion_date' => $validated['target_completion_date'] ?? null,
            'status' => $validated['status'],
            'progress' => $validated['progress'],
        ]);

        if ($project->wasChanged()) {
            $this->citizenNotifications->sendToCitizens(
                CitizenUpdate::projectInformationUpdated($project)
            );
        }

        return back()->with(
            'success',
            'Project information updated successfully.'
        );
    }

    public function destroy(Project $project)
    {
        $imagePath = $project->image_path;
        $project->delete();

        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        return back()->with(
            'success',
            'Project deleted successfully.'
        );
    }
}
