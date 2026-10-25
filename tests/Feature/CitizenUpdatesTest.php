<?php

namespace Tests\Feature;

use App\Models\AdministrativePost;
use App\Models\Project;
use App\Models\User;
use App\Notifications\CitizenUpdate;
use App\Notifications\ProjectProgressUpdated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CitizenUpdatesTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_project_creation_notifies_citizens_only(): void
    {
        Storage::fake('public');

        $engineer = User::factory()->create([
            'role' => 'engineering',
        ]);
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($engineer)->post('/engineering/projects', [
            'project_name' => 'Community Health Center',
            'description' => 'A new health center.',
            'implementing_office' => 'Municipal Engineering Office',
            'contractor' => 'Pagudpud Builders',
            'location' => 'Pagudpud',
            'latitude' => 18.5601,
            'longitude' => 120.7862,
            'image' => UploadedFile::fake()->image('health-center.jpg'),
            'budget' => 250000,
            'status' => 'Planned',
            'progress' => 0,
        ]);

        $response->assertRedirect('/engineering/projects');
        $notification = $citizen->notifications()->firstOrFail();
        $project = Project::query()->firstOrFail();
        Storage::disk('public')->assertExists($project->image_path);

        $this->assertSame('project_created', $notification->data['type']);
        $this->assertSame(
            "/citizen/projects/{$project->id}",
            $notification->data['url'],
        );
        $this->assertSame(0, $admin->notifications()->count());
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'implementing_office' => 'Municipal Engineering Office',
            'contractor' => 'Pagudpud Builders',
            'latitude' => 18.5601,
            'longitude' => 120.7862,
            'image_path' => $project->image_path,
        ]);

        $this->actingAs($citizen)
            ->get('/citizen/dashboard')
            ->assertInertia(fn ($page) => $page
                ->component('Citizen/Dashboard')
                ->where('projects.0.project_name', 'Community Health Center')
                ->where('projects.0.image_path', $project->image_path)
                ->where(
                    'projects.0.image_url',
                    "/media/{$project->image_path}",
                )
            );

        $this->actingAs($citizen)
            ->get("/citizen/projects/{$project->id}")
            ->assertInertia(fn ($page) => $page
                ->component('Citizen/ProjectDetails')
                ->where(
                    'project.implementing_office',
                    'Municipal Engineering Office',
                )
                ->where('project.contractor', 'Pagudpud Builders')
                ->where('project.latitude', '18.5601000')
                ->where('project.longitude', '120.7862000')
            );
    }

    public function test_project_images_can_be_stored_and_served_from_the_configured_upload_disk(): void
    {
        Storage::fake('r2', [
            'url' => 'https://images.example.com',
        ]);
        config(['filesystems.upload_disk' => 'r2']);

        $engineer = User::factory()->create([
            'role' => 'engineering',
        ]);

        $response = $this->actingAs($engineer)->post('/engineering/projects', [
            'project_name' => 'Community Health Center',
            'description' => 'A new health center.',
            'location' => 'Pagudpud',
            'latitude' => 18.5601,
            'longitude' => 120.7862,
            'image' => UploadedFile::fake()->image('health-center.jpg'),
            'budget' => 250000,
            'status' => 'Planned',
            'progress' => 0,
        ]);

        $response->assertRedirect('/engineering/projects');
        $project = Project::query()->firstOrFail();
        Storage::disk('r2')->assertExists($project->image_path);
        $this->assertSame(
            "/media/{$project->image_path}",
            $project->image_url,
        );
    }

    public function test_publishing_an_announcement_notifies_citizens(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);

        $response = $this->actingAs($admin)->post('/admin/posts', [
            'title' => 'Town Hall Meeting',
            'content' => 'Join us for a community meeting.',
        ]);

        $response->assertRedirect();
        $notification = $citizen->notifications()->firstOrFail();

        $this->assertSame('announcement', $notification->data['type']);
        $this->assertSame('Town Hall Meeting', $notification->data['message']);
        $this->assertSame('/citizen/posts', $notification->data['url']);
    }

    public function test_updated_announcement_notifies_citizens(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $post = AdministrativePost::create([
            'title' => 'Town Hall Meeting',
            'content' => 'Join us for a community meeting.',
            'user_id' => $admin->id,
        ]);

        $response = $this->actingAs($admin)->put("/admin/posts/{$post->id}", [
            'title' => 'Updated Town Hall Meeting',
            'content' => 'The meeting is now on Friday.',
        ]);

        $response->assertRedirect();
        $notification = $citizen->notifications()->firstOrFail();

        $this->assertSame(
            'announcement_updated',
            $notification->data['type'],
        );
        $this->assertSame(
            'Updated Town Hall Meeting',
            $notification->data['message'],
        );
    }

    public function test_admin_project_edits_notify_citizens(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $project = $this->createProject();

        $response = $this->actingAs($admin)->put(
            "/admin/projects/{$project->id}",
            [
                'project_name' => 'Road Improvement Phase 2',
                'description' => 'Updated road paving project.',
                'implementing_office' => 'Municipal Engineering Office',
                'contractor' => 'North Coast Construction',
                'location' => 'Pagudpud',
                'latitude' => 18.5612,
                'longitude' => 120.7873,
                'budget' => 150000,
                'status' => 'Ongoing',
                'progress' => 25,
            ],
        );

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'implementing_office' => 'Municipal Engineering Office',
            'contractor' => 'North Coast Construction',
            'latitude' => 18.5612,
            'longitude' => 120.7873,
        ]);
        $notification = $citizen->notifications()->firstOrFail();

        $this->assertSame('project_updated', $notification->data['type']);
        $this->assertSame(
            "/citizen/projects/{$project->id}",
            $notification->data['url'],
        );
    }

    public function test_deleting_a_project_removes_its_uploaded_image(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $imagePath = UploadedFile::fake()
            ->image('project.jpg')
            ->store('projects', 'public');
        $project = Project::create([
            'project_name' => 'Road Improvement',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Planned',
            'progress' => 0,
            'image_path' => $imagePath,
        ]);

        $response = $this->actingAs($admin)
            ->delete("/admin/projects/{$project->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
        Storage::disk('public')->assertMissing($imagePath);
    }

    public function test_viewing_a_project_marks_only_its_notifications_as_read(): void
    {
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $project = $this->createProject();
        $anotherProject = Project::create([
            'project_name' => 'Water System',
            'description' => 'Community water system.',
            'location' => 'Pagudpud',
            'budget' => 50000,
            'status' => 'Planned',
            'progress' => 0,
        ]);

        $citizen->notify(CitizenUpdate::projectCreated($project));
        $citizen->notify(new ProjectProgressUpdated($project));
        $citizen->notify(CitizenUpdate::projectCreated($anotherProject));

        $response = $this->actingAs($citizen)
            ->get("/citizen/projects/{$project->id}");

        $response->assertOk();
        $projectNotifications = $citizen->notifications()
            ->where('data->project_id', $project->id)
            ->get();
        $anotherProjectNotification = $citizen->notifications()
            ->where('data->project_id', $anotherProject->id)
            ->firstOrFail();

        $this->assertCount(2, $projectNotifications);
        $this->assertTrue($projectNotifications->every(
            fn ($notification) => $notification->read_at !== null
        ));
        $this->assertNull($anotherProjectNotification->read_at);
    }

    public function test_viewing_the_project_list_marks_project_notifications_as_read(): void
    {
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $project = $this->createProject();
        $post = AdministrativePost::create([
            'title' => 'Town Hall Meeting',
            'content' => 'Join the meeting.',
            'user_id' => User::factory()->create([
                'role' => 'admin',
            ])->id,
        ]);

        $citizen->notify(CitizenUpdate::projectCreated($project));
        $citizen->notify(CitizenUpdate::announcementPublished($post));

        $response = $this->actingAs($citizen)->get('/citizen/projects');

        $response->assertOk();
        $projectNotification = $citizen->notifications()
            ->where('data->type', 'project_created')
            ->firstOrFail();
        $announcementNotification = $citizen->notifications()
            ->where('data->type', 'announcement')
            ->firstOrFail();

        $this->assertNotNull($projectNotification->read_at);
        $this->assertNull($announcementNotification->read_at);
    }

    public function test_viewing_announcements_marks_announcement_notifications_as_read(): void
    {
        $citizen = User::factory()->create([
            'role' => 'citizen',
        ]);
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $post = AdministrativePost::create([
            'title' => 'Town Hall Meeting',
            'content' => 'Join the meeting.',
            'user_id' => $admin->id,
        ]);
        $project = $this->createProject();

        $citizen->notify(CitizenUpdate::announcementPublished($post));
        $citizen->notify(CitizenUpdate::announcementPublished($post, updated: true));
        $citizen->notify(CitizenUpdate::projectCreated($project));

        $response = $this->actingAs($citizen)->get('/citizen/posts');

        $response->assertOk();
        $announcementNotifications = $citizen->notifications()
            ->whereIn('data->type', ['announcement', 'announcement_updated'])
            ->get();
        $projectNotification = $citizen->notifications()
            ->where('data->type', 'project_created')
            ->firstOrFail();

        $this->assertCount(2, $announcementNotifications);
        $this->assertTrue($announcementNotifications->every(
            fn ($notification) => $notification->read_at !== null
        ));
        $this->assertNull($projectNotification->read_at);
    }

    private function createProject(): Project
    {
        return Project::create([
            'project_name' => 'Road Improvement',
            'description' => 'Road paving project.',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Planned',
            'progress' => 0,
        ]);
    }
}
