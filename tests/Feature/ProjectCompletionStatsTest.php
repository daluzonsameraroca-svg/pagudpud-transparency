<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectCompletionStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_role_dashboards_show_distinct_project_completions_by_two_year_period(): void
    {
        $this->travelTo(now()->setDate(2026, 10, 23));

        $olderProject = $this->createProject();
        $this->addProgressUpdate($olderProject, 'Completed', '2021-06-15');

        $repeatedProject = $this->createProject();
        $this->addProgressUpdate($repeatedProject, 'Completed', '2022-03-10');
        $this->addProgressUpdate($repeatedProject, 'Completed', '2023-08-21');

        $anotherProject = $this->createProject();
        $this->addProgressUpdate($anotherProject, 'Completed', '2023-04-02');

        $laterProject = $this->createProject();
        $this->addProgressUpdate($laterProject, 'Completed', '2024-01-12');

        $pendingProject = $this->createProject();
        $this->addProgressUpdate($pendingProject, 'Ongoing', '2025-05-18');
        $this->addProgressUpdate($pendingProject, 'Completed', '2027-02-11');

        $expectedStats = [
            ['period' => '2020-2021', 'completedProjects' => 1],
            ['period' => '2022-2023', 'completedProjects' => 2],
            ['period' => '2024-2025', 'completedProjects' => 1],
            ['period' => '2026-2027', 'completedProjects' => 0],
        ];
        $dashboards = [
            ['citizen', '/citizen/dashboard', 'Citizen/Dashboard'],
            ['engineering', '/engineering/dashboard', 'Engineering/Dashboard'],
            ['admin', '/admin/dashboard', 'Admin/Dashboard'],
        ];

        foreach ($dashboards as [$role, $url, $component]) {
            $user = User::factory()->create(['role' => $role]);
            $response = $this->actingAs($user)->get($url);

            $response->assertOk();
            $response->assertInertia(fn ($page) => $page
                ->component($component)
                ->where('completionStats', $expectedStats)
            );
        }
    }

    public function test_dashboard_includes_the_current_period_when_no_projects_are_completed(): void
    {
        $this->travelTo(now()->setDate(2026, 10, 23));
        $citizen = User::factory()->create(['role' => 'citizen']);

        $response = $this->actingAs($citizen)->get('/citizen/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Citizen/Dashboard')
            ->where('completionStats', [
                ['period' => '2026-2027', 'completedProjects' => 0],
            ])
        );
    }

    public function test_citizen_dashboard_lists_all_planned_ongoing_and_suspended_projects(): void
    {
        $this->travelTo('2026-10-25 10:00:00');

        $completedProject = $this->createProject();
        $completedProject->update(['status' => 'Completed']);

        $this->travel(1)->seconds();
        $ongoingProject = $this->createProject();

        $this->travel(1)->seconds();
        $plannedProject = $this->createProject();
        $plannedProject->update(['status' => 'Planned']);

        $this->travel(1)->seconds();
        $suspendedProject = $this->createProject();
        $suspendedProject->update(['status' => 'Suspended']);
        $citizen = User::factory()->create(['role' => 'citizen']);

        $response = $this->actingAs($citizen)->get('/citizen/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Citizen/Dashboard')
            ->has('projects', 4)
            ->has('activeProjects', 3)
            ->where('activeProjects.0.id', $suspendedProject->id)
            ->where('activeProjects.1.id', $plannedProject->id)
            ->where('activeProjects.2.id', $ongoingProject->id)
        );
    }

    public function test_completed_projects_remain_available_in_each_role_project_list(): void
    {
        $project = $this->createProject();
        $project->update([
            'status' => 'Completed',
            'progress' => 100,
        ]);
        $projectLists = [
            ['citizen', '/citizen/projects', 'Citizen/Projects'],
            ['engineering', '/engineering/projects', 'Engineering/Projects'],
            ['admin', '/admin/projects', 'Admin/Projects'],
        ];

        foreach ($projectLists as [$role, $url, $component]) {
            $user = User::factory()->create(['role' => $role]);
            $response = $this->actingAs($user)->get($url);

            $response->assertOk();
            $response->assertInertia(fn ($page) => $page
                ->component($component)
                ->where('projects.0.id', $project->id)
                ->where('projects.0.status', 'Completed')
            );
        }
    }

    public function test_citizen_project_details_include_progress_history_in_date_order(): void
    {
        $project = $this->createProject();
        $project->progressUpdates()->createMany([
            [
                'status' => 'Ongoing',
                'progress' => 75,
                'update_date' => '2026-03-15',
            ],
            [
                'status' => 'Ongoing',
                'progress' => 20,
                'update_date' => '2025-01-10',
            ],
        ]);
        $citizen = User::factory()->create(['role' => 'citizen']);

        $response = $this->actingAs($citizen)
            ->get("/citizen/projects/{$project->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Citizen/ProjectDetails')
            ->where('project.id', $project->id)
            ->has('project.progress_updates', 2)
            ->where('project.progress_updates.0.progress', 20)
            ->where('project.progress_updates.1.progress', 75)
        );
    }

    private function createProject(): Project
    {
        return Project::create([
            'project_name' => 'Community Road Project',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 50,
        ]);
    }

    private function addProgressUpdate(
        Project $project,
        string $status,
        string $updateDate,
    ): void {
        $project->progressUpdates()->create([
            'status' => $status,
            'progress' => $status === 'Completed' ? 100 : 50,
            'update_date' => $updateDate,
        ]);
    }
}
