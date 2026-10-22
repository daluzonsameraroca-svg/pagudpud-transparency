<?php

namespace App\Notifications;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProjectProgressUpdated extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Project $project,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'project_progress',
            'title' => 'Project progress updated',
            'project_id' => $this->project->id,
            'project_name' => $this->project->project_name,
            'status' => $this->project->status,
            'progress' => $this->project->progress,
            'url' => "/citizen/projects/{$this->project->id}",
            'message' => sprintf(
                '%s is now %s at %d%% progress.',
                $this->project->project_name,
                $this->project->status,
                $this->project->progress,
            ),
        ];
    }
}
