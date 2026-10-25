<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicImageControllerTest extends TestCase
{
    public function test_it_streams_public_images_from_the_configured_upload_disk(): void
    {
        Storage::fake('r2');
        Storage::disk('r2')->put('projects/road.jpg', 'image bytes');
        config(['filesystems.upload_disk' => 'r2']);

        $response = $this->get('/media/projects/road.jpg');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'image/jpeg');
        $response->assertHeader('Content-Disposition', 'inline');
        $response->assertHeader('Cache-Control', 'max-age=86400, public');
        $this->assertSame('image bytes', $response->streamedContent());
    }

    public function test_missing_images_return_not_found(): void
    {
        Storage::fake('r2');
        config(['filesystems.upload_disk' => 'r2']);

        $this->get('/media/projects/missing.jpg')->assertNotFound();
    }

    public function test_only_project_and_feedback_image_paths_are_served(): void
    {
        Storage::fake('r2');
        config(['filesystems.upload_disk' => 'r2']);

        $this->get('/media/users/private.jpg')->assertNotFound();
        $this->get('/media/projects/../private.jpg')->assertNotFound();
        $this->get('/media/projects/script.svg')->assertNotFound();
    }
}
