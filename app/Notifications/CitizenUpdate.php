<?php

namespace App\Notifications;

use App\Models\AdministrativePost;
use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class CitizenUpdate extends Notification
{
    use Queueable;

    private function __construct(
        private readonly array $data,
    ) {}

    public static function projectCreated(Project $project): self
    {
        return new self([
            'type' => 'project_created',
            'title' => 'New project added',
            'project_id' => $project->id,
            'message' => sprintf(
                'A new project, "%s", has been added.',
                $project->project_name,
            ),
            'url' => "/citizen/projects/{$project->id}",
        ]);
    }

    public static function projectInformationUpdated(Project $project): self
    {
        return new self([
            'type' => 'project_updated',
            'title' => 'Project information updated',
            'project_id' => $project->id,
            'message' => sprintf(
                'The details for "%s" have been updated.',
                $project->project_name,
            ),
            'url' => "/citizen/projects/{$project->id}",
        ]);
    }

    public static function announcementPublished(
        AdministrativePost $post,
        bool $updated = false,
    ): self {
        return new self([
            'type' => $updated ? 'announcement_updated' : 'announcement',
            'title' => $updated ? 'Announcement updated' : 'New announcement',
            'message' => $post->title,
            'details' => Str::limit(strip_tags($post->content), 180),
            'url' => '/citizen/posts',
        ]);
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return $this->data;
    }
}
