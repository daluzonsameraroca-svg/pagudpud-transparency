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
                ->where('feedback.0.image_url', $feedback->image_url)
            );

        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/admin/feedback')
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Feedback')
                ->where('feedback.0.image_url', $feedback->image_url)
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
