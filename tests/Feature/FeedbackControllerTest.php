<?php

namespace Tests\Feature;

use App\Models\Feedback;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FeedbackControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_can_submit_a_project_concern_with_an_optional_photo(): void
    {
        Storage::fake('public');

        $citizen = User::factory()->create(['role' => 'citizen']);
        $project = $this->createProject();

        $response = $this->actingAs($citizen)
            ->from("/citizen/projects/{$project->id}")
            ->post("/citizen/projects/{$project->id}/feedback", [
                'message' => 'There has been no visible progress for months.',
                'image' => UploadedFile::fake()->image('site-condition.jpg'),
            ]);

        $response->assertRedirect("/citizen/projects/{$project->id}");
        $feedback = Feedback::query()->firstOrFail();
        Storage::disk('public')->assertExists($feedback->image_path);
        $this->assertDatabaseHas('feedback', [
            'id' => $feedback->id,
            'user_id' => $citizen->id,
            'project_id' => $project->id,
            'message' => 'There has been no visible progress for months.',
            'image_path' => $feedback->image_path,
        ]);

        $this->actingAs($citizen)
            ->get('/citizen/feedback')
            ->assertInertia(fn ($page) => $page
                ->component('Citizen/Feedback')
                ->where('feedback.0.image_path', $feedback->image_path)
                ->where(
                    'feedback.0.image_url',
                    "/media/{$feedback->image_path}",
                )
            );

        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/admin/feedback')
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Feedback')
                ->where(
                    'feedback.0.image_url',
                    "/media/{$feedback->image_path}",
                )
            );
    }

    public function test_feedback_image_url_uses_the_configured_upload_disk(): void
    {
        Storage::fake('r2', [
            'url' => 'https://images.example.com',
        ]);
        config(['filesystems.upload_disk' => 'r2']);

        $feedback = new Feedback([
            'image_path' => 'feedback/site-condition.jpg',
        ]);

        $this->assertSame(
            '/media/feedback/site-condition.jpg',
            $feedback->image_url,
        );
    }

    public function test_citizen_can_submit_a_project_concern_without_a_photo(): void
    {
        Storage::fake('public');

        $citizen = User::factory()->create(['role' => 'citizen']);
        $project = $this->createProject();

        $response = $this->actingAs($citizen)
            ->from("/citizen/projects/{$project->id}")
            ->post("/citizen/projects/{$project->id}/feedback", [
                'message' => 'The work site appears to be unattended.',
            ]);

        $response->assertRedirect("/citizen/projects/{$project->id}");
        $feedback = Feedback::query()->firstOrFail();
        $this->assertNull($feedback->image_path);
        $this->assertNull($feedback->image_url);
        $this->assertDatabaseHas('feedback', [
            'id' => $feedback->id,
            'image_path' => null,
        ]);
    }

    public function test_citizen_cannot_submit_a_non_image_as_feedback_photo(): void
    {
        Storage::fake('public');

        $citizen = User::factory()->create(['role' => 'citizen']);
        $project = $this->createProject();

        $response = $this->actingAs($citizen)
            ->from("/citizen/projects/{$project->id}")
            ->post("/citizen/projects/{$project->id}/feedback", [
                'message' => 'There has been no visible progress for months.',
                'image' => UploadedFile::fake()->create(
                    'report.pdf',
                    100,
                    'application/pdf',
                ),
            ]);

        $response->assertRedirect("/citizen/projects/{$project->id}");
        $response->assertSessionHasErrors(['image']);
        $this->assertDatabaseCount('feedback', 0);
        Storage::disk('public')->assertDirectoryEmpty('feedback');
    }

    public function test_citizen_can_edit_their_feedback_and_replace_its_photo(): void
    {
        Storage::fake('public');
        $citizen = User::factory()->create(['role' => 'citizen']);
        $project = $this->createProject();
        $oldImagePath = UploadedFile::fake()
            ->image('old-photo.jpg')
            ->store('feedback', 'public');
        $feedback = Feedback::create([
            'user_id' => $citizen->id,
            'project_id' => $project->id,
            'message' => 'The road work has not started.',
            'image_path' => $oldImagePath,
        ]);

        $response = $this->actingAs($citizen)
            ->from('/citizen/feedback')
            ->put("/citizen/feedback/{$feedback->id}", [
                'message' => 'The road work has now started.',
                'image' => UploadedFile::fake()->image('new-photo.png'),
            ]);

        $response->assertRedirect('/citizen/feedback');
        $feedback->refresh();
        $this->assertSame('The road work has now started.', $feedback->message);
        $this->assertSame('Pending', $feedback->status);
        $this->assertNotSame($oldImagePath, $feedback->image_path);
        Storage::disk('public')->assertMissing($oldImagePath);
        Storage::disk('public')->assertExists($feedback->image_path);
    }

    public function test_citizen_can_remove_the_photo_from_their_feedback(): void
    {
        Storage::fake('public');
        $citizen = User::factory()->create(['role' => 'citizen']);
        $project = $this->createProject();
        $imagePath = UploadedFile::fake()
            ->image('site-photo.jpg')
            ->store('feedback', 'public');
        $feedback = Feedback::create([
            'user_id' => $citizen->id,
            'project_id' => $project->id,
            'message' => 'The road work has not started.',
            'image_path' => $imagePath,
        ]);

        $response = $this->actingAs($citizen)
            ->from('/citizen/feedback')
            ->put("/citizen/feedback/{$feedback->id}", [
                'message' => 'The road work has not started.',
                'remove_image' => true,
            ]);

        $response->assertRedirect('/citizen/feedback');
        $this->assertNull($feedback->fresh()->image_path);
        Storage::disk('public')->assertMissing($imagePath);
    }

    public function test_citizen_can_delete_their_feedback_and_its_photo(): void
    {
        Storage::fake('public');
        $citizen = User::factory()->create(['role' => 'citizen']);
        $project = $this->createProject();
        $imagePath = UploadedFile::fake()
            ->image('site-photo.jpg')
            ->store('feedback', 'public');
        $feedback = Feedback::create([
            'user_id' => $citizen->id,
            'project_id' => $project->id,
            'message' => 'The road work has not started.',
            'image_path' => $imagePath,
        ]);

        $response = $this->actingAs($citizen)
            ->from('/citizen/feedback')
            ->delete("/citizen/feedback/{$feedback->id}");

        $response->assertRedirect('/citizen/feedback');
        $this->assertDatabaseMissing('feedback', ['id' => $feedback->id]);
        Storage::disk('public')->assertMissing($imagePath);
    }

    public function test_citizen_cannot_edit_or_delete_another_citizens_feedback(): void
    {
        Storage::fake('public');
        $owner = User::factory()->create(['role' => 'citizen']);
        $otherCitizen = User::factory()->create(['role' => 'citizen']);
        $project = $this->createProject();
        $imagePath = UploadedFile::fake()
            ->image('site-photo.jpg')
            ->store('feedback', 'public');
        $feedback = Feedback::create([
            'user_id' => $owner->id,
            'project_id' => $project->id,
            'message' => 'The road work has not started.',
            'image_path' => $imagePath,
        ]);

        $this->actingAs($otherCitizen)
            ->put("/citizen/feedback/{$feedback->id}", [
                'message' => 'This is not my feedback.',
            ])
            ->assertNotFound();

        $this->actingAs($otherCitizen)
            ->delete("/citizen/feedback/{$feedback->id}")
            ->assertNotFound();

        $this->assertSame(
            'The road work has not started.',
            $feedback->fresh()->message,
        );
        Storage::disk('public')->assertExists($imagePath);
    }

    public function test_non_citizen_cannot_edit_or_delete_feedback_through_citizen_routes(): void
    {
        Storage::fake('public');
        $owner = User::factory()->create(['role' => 'citizen']);
        $admin = User::factory()->create(['role' => 'admin']);
        $project = $this->createProject();
        $feedback = Feedback::create([
            'user_id' => $owner->id,
            'project_id' => $project->id,
            'message' => 'The road work has not started.',
        ]);

        $this->actingAs($admin)
            ->put("/citizen/feedback/{$feedback->id}", [
                'message' => 'Updated feedback from admin.',
            ])
            ->assertForbidden();

        $this->actingAs($admin)
            ->delete("/citizen/feedback/{$feedback->id}")
            ->assertForbidden();

        $this->assertSame(
            'The road work has not started.',
            $feedback->fresh()->message,
        );
    }

    private function createProject(): Project
    {
        return Project::create([
            'project_name' => 'Road Improvement',
            'location' => 'Pagudpud',
            'budget' => 100000,
            'status' => 'Ongoing',
            'progress' => 25,
        ]);
    }
}
