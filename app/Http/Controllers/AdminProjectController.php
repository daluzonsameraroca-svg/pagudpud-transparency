<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class AdminProjectController extends Controller
{
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

            'location' => [
                'required',
                'string',
                'max:255',
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
            'location' => $validated['location'],
            'budget' => $validated['budget'],
            'start_date' => $validated['start_date'] ?? null,
            'target_completion_date' =>
                $validated['target_completion_date'] ?? null,
            'status' => $validated['status'],
            'progress' => $validated['progress'],
        ]);

        return back()->with(
            'success',
            'Project information updated successfully.'
        );
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return back()->with(
            'success',
            'Project deleted successfully.'
        );
    }
}