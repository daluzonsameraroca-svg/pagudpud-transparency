<?php

namespace Tests\Feature;

use App\Models\AdministrativePost;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CitizenUpdatesTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_project_creation_notifies_citizens_only(): void
    {
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
            'location' => 'Pagudpud',
            'budget' => 250000,
            'status' => 'Planned',
            'progress' => 0,
        ]);

        $response->assertRedirect('/engineering/projects');
        $notification = $citizen->notifications()->firstOrFail();
        $project = Project::query()->firstOrFail();

        $this->assertSame('project_created', $notification->data['type']);
        $this->assertSame(
            "/citizen/projects/{$project->id}",
            $notification->data['url'],
        );
        $this->assertSame(0, $admin->notifications()->count());
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
                'location' => 'Pagudpud',
                'budget' => 150000,
                'status' => 'Ongoing',
                'progress' => 25,
            ],
        );

        $response->assertRedirect();
        $notification = $citizen->notifications()->firstOrFail();

        $this->assertSame('project_updated', $notification->data['type']);
        $this->assertSame(
            "/citizen/projects/{$project->id}",
            $notification->data['url'],
        );
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
