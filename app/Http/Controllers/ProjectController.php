<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display projects available to citizens.
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $projects = Project::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where(
                        'project_name',
                        'like',
                        "%{$search}%"
                    )->orWhere(
                        'location',
                        'like',
                        "%{$search}%"
                    )->orWhere(
                        'description',
                        'like',
                        "%{$search}%"
                    );
                });
            })
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Citizen/Projects', [
            'projects' => $projects,
            'search' => $search,
        ]);
    }

    /**
     * Display project details and its progress history.
     */
    public function show(Project $project)
    {
        $project->load([
            'progressUpdates' => function ($query) {
                $query->orderBy('update_date', 'asc')
                    ->orderBy('created_at', 'asc')
                    ->orderBy('id', 'asc');
            },
        ]);

        return Inertia::render('Citizen/ProjectDetails', [
            'project' => $project,
        ]);
    }
}