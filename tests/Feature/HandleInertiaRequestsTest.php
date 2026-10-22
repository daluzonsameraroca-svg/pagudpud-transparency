<?php

namespace Tests\Feature;

use App\Models\AdministrativePost;
use App\Models\Feedback;
use App\Models\Project;
use App\Models\User;
use App\Notifications\CitizenUpdate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HandleInertiaRequestsTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_notification_controls_have_shared_data_on_every_citizen_page(): void
    {
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $post = AdministrativePost::create([
            'title' => 'Town Hall Meeting',
            'content' => 'Join the community meeting.',
            'user_id' => $admin->id,
        ]);
        $citizen->notify(CitizenUpdate::announcementPublished($post));

        $response = $this->actingAs($citizen)->get('/citizen/feedback');

        $response->assertInertia(fn ($page) => $page
            ->component('Citizen/Feedback')
            ->where('auth.user.name', $citizen->name)
            ->has('notifications', 1)
            ->where('notifications.0.data.title', 'New announcement')
            ->where('unreadNotificationCount', 1)
        );
    }

    public function test_non_citizen_dashboard_pages_do_not_receive_citizen_notifications(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
            ->where('auth.user.name', $admin->name)
            ->has('notifications', 0)
            ->has('citizenFeedbackProjects', 0)
            ->where('unreadNotificationCount', 0)
        );
    }

    public function test_citizen_sidebar_receives_only_projects_they_have_given_feedback_on(): void
    {
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $anotherCitizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $roadProject = Project::create([
            'project_name' => 'Road Improvement',
            'description' => 'Road paving project',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 25,
        ]);
        $bridgeProject = Project::create([
            'project_name' => 'Bridge Repair',
            'description' => 'Bridge repair project',
            'location' => 'Pagudpud',
            'budget' => 150000,
            'status' => 'Planned',
            'progress' => 0,
        ]);
        Feedback::create([
            'user_id' => $citizen->id,
            'project_id' => $roadProject->id,
            'message' => 'Please improve the pedestrian walkway.',
        ]);
        Feedback::create([
            'user_id' => $citizen->id,
            'project_id' => $roadProject->id,
            'message' => 'Please add road signs.',
        ]);
        Feedback::create([
            'user_id' => $anotherCitizen->id,
            'project_id' => $bridgeProject->id,
            'message' => 'Please inspect the bridge.',
        ]);

        $response = $this->actingAs($citizen)->get('/citizen/feedback');

        $response->assertInertia(fn ($page) => $page
            ->component('Citizen/Feedback')
            ->has('citizenFeedbackProjects', 1)
            ->where('citizenFeedbackProjects.0.id', $roadProject->id)
            ->where('citizenFeedbackProjects.0.project_name', 'Road Improvement')
        );
    }
}
