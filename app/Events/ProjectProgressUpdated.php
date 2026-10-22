<?php

namespace App\Events;

use App\Models\Project;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Contracts\Broadcasting\ShouldRescue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectProgressUpdated implements ShouldBroadcastNow, ShouldRescue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $project;

    public function __construct(Project $project)
    {
        $this->project = $project->load([
            'progressUpdates' => function ($query) {
                $query->orderBy('update_date', 'asc')
                    ->orderBy('created_at', 'asc')
                    ->orderBy('id', 'asc');
            },
        ]);
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('projects'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'project.progress.updated';
    }
}
