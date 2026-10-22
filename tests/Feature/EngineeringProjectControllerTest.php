<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectProgressUpdated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EngineeringProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_progress_update_creates_notifications_for_all_citizens(): void
    {
        $engineer = User::factory()->create([
            'role' => 'engineering',
        ]);
        $citizens = User::factory()->count(2)->create([
            'role' => 'citizen',
        ]);
        User::factory()->create([
            'role' => 'admin',
        ]);
        $project = Project::create([
            'project_name' => 'Road Improvement',
            'description' => 'Road paving project',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Planned',
            'progress' => 0,
        ]);

        $response = $this->actingAs($engineer)
            ->from('/engineering/projects')
            ->put("/engineering/projects/{$project->id}", [
                'status' => 'Ongoing',
                'progress' => 25,
                'update_description' => 'Construction started',
                'update_date' => '2026-10-22',
            ]);

        $response->assertRedirect('/engineering/projects');
        $this->assertDatabaseCount('notifications', 2);

        foreach ($citizens as $citizen) {
            $notification = $citizen->notifications()->firstOrFail();

            $this->assertSame(
                'Road Improvement',
                $notification->data['project_name'],
            );
            $this->assertSame(25, $notification->data['progress']);
        }

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'status' => 'Ongoing',
            'progress' => 25,
        ]);
    }

    public function test_citizen_dashboard_includes_recent_notifications_and_unread_count(): void
    {
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $project = Project::create([
            'project_name' => 'Road Improvement',
            'description' => 'Road paving project',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 25,
        ]);
        $citizen->notify(new ProjectProgressUpdated($project));

        $response = $this->actingAs($citizen)->get('/citizen/dashboard');

        $response->assertInertia(fn ($page) => $page
            ->component('Citizen/Dashboard')
            ->where('isNewCitizen', false)
            ->has('notifications', 1)
            ->where('unreadNotificationCount', 1)
            ->where('notifications.0.data.project_name', 'Road Improvement')
        );
    }

    public function test_citizen_can_mark_their_notification_as_read(): void
    {
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $project = Project::create([
            'project_name' => 'Road Improvement',
            'description' => 'Road paving project',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 25,
        ]);
        $citizen->notify(new ProjectProgressUpdated($project));
        $notification = $citizen->notifications()->firstOrFail();

        $response = $this->actingAs($citizen)
            ->from('/citizen/dashboard')
            ->patch("/citizen/notifications/{$notification->id}/read");

        $response->assertRedirect('/citizen/dashboard');
        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_citizen_cannot_mark_another_users_notification_as_read(): void
    {
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $anotherCitizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $project = Project::create([
            'project_name' => 'Road Improvement',
            'description' => 'Road paving project',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 25,
        ]);
        $anotherCitizen->notify(new ProjectProgressUpdated($project));
        $notification = $anotherCitizen->notifications()->firstOrFail();

        $response = $this->actingAs($citizen)
            ->patch("/citizen/notifications/{$notification->id}/read");

        $response->assertNotFound();
        $this->assertNull($notification->fresh()->read_at);
    }

    public function test_non_citizen_cannot_mark_citizen_notifications_as_read(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->patch('/citizen/notifications/notification-id/read');

        $response->assertForbidden();
    }
}
