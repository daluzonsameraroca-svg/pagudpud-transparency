<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectProgressUpdated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EngineeringProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_engineer_must_provide_a_valid_map_pin_when_creating_a_project(): void
    {
        $engineer = User::factory()->create([
            'role' => 'engineering',
        ]);

        $response = $this->actingAs($engineer)
            ->from('/engineering/projects/create')
            ->post('/engineering/projects', [
                'project_name' => 'Road Improvement',
                'location' => 'Balaoi, Pagudpud, Ilocos Norte',
                'budget' => 100000,
                'status' => 'Planned',
                'progress' => 0,
                'latitude' => 95,
                'longitude' => 120.79,
                'image' => UploadedFile::fake()->image('project.jpg'),
            ]);

        $response->assertRedirect('/engineering/projects/create');
        $response->assertSessionHasErrors(['latitude']);
        $this->assertDatabaseCount('projects', 0);
    }

    public function test_engineer_must_upload_a_project_image(): void
    {
        $engineer = User::factory()->create([
            'role' => 'engineering',
        ]);

        $response = $this->actingAs($engineer)
            ->from('/engineering/projects/create')
            ->post('/engineering/projects', [
                'project_name' => 'Road Improvement',
                'location' => 'Balaoi, Pagudpud, Ilocos Norte',
                'latitude' => 18.6024,
                'longitude' => 120.8532,
                'budget' => 100000,
                'status' => 'Planned',
                'progress' => 0,
            ]);

        $response->assertRedirect('/engineering/projects/create');
        $response->assertSessionHasErrors(['image']);
        $this->assertDatabaseCount('projects', 0);
    }

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

    public function test_engineer_can_replace_a_project_image_during_a_progress_update(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('projects/old.jpg', 'old image');

        $engineer = User::factory()->create(['role' => 'engineering']);
        $project = Project::create([
            'project_name' => 'Road Improvement',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 25,
            'image_path' => 'projects/old.jpg',
        ]);

        $response = $this->actingAs($engineer)
            ->from('/engineering/projects')
            ->put("/engineering/projects/{$project->id}", [
                'status' => 'Ongoing',
                'progress' => 50,
                'update_description' => 'Work is halfway complete',
                'update_date' => '2026-10-23',
                'image' => UploadedFile::fake()->image('updated-project.png'),
            ]);

        $response->assertRedirect('/engineering/projects');
        $project->refresh();
        $this->assertNotSame('projects/old.jpg', $project->image_path);
        Storage::disk('public')->assertMissing('projects/old.jpg');
        Storage::disk('public')->assertExists($project->image_path);
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'progress' => 50,
            'image_path' => $project->image_path,
        ]);
    }

    public function test_engineer_can_remove_a_project_image_during_a_progress_update(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('projects/current.jpg', 'current image');

        $engineer = User::factory()->create(['role' => 'engineering']);
        $project = Project::create([
            'project_name' => 'Road Improvement',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 25,
            'image_path' => 'projects/current.jpg',
        ]);

        $response = $this->actingAs($engineer)
            ->from('/engineering/projects')
            ->put("/engineering/projects/{$project->id}", [
                'status' => 'Ongoing',
                'progress' => 50,
                'update_description' => 'Work is halfway complete',
                'update_date' => '2026-10-23',
                'remove_image' => '1',
            ]);

        $response->assertRedirect('/engineering/projects');
        $project->refresh();
        $this->assertNull($project->image_path);
        Storage::disk('public')->assertMissing('projects/current.jpg');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'progress' => 50,
            'image_path' => null,
        ]);
    }

    public function test_engineer_cannot_replace_a_project_image_with_an_invalid_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('projects/current.jpg', 'current image');

        $engineer = User::factory()->create(['role' => 'engineering']);
        $project = Project::create([
            'project_name' => 'Road Improvement',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 25,
            'image_path' => 'projects/current.jpg',
        ]);

        $response = $this->actingAs($engineer)
            ->from('/engineering/projects')
            ->put("/engineering/projects/{$project->id}", [
                'status' => 'Ongoing',
                'progress' => 50,
                'update_date' => '2026-10-23',
                'image' => UploadedFile::fake()->create(
                    'document.pdf',
                    100,
                    'application/pdf',
                ),
            ]);

        $response->assertRedirect('/engineering/projects');
        $response->assertSessionHasErrors(['image']);
        $this->assertSame('projects/current.jpg', $project->fresh()->image_path);
        Storage::disk('public')->assertExists('projects/current.jpg');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'progress' => 25,
            'image_path' => 'projects/current.jpg',
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
