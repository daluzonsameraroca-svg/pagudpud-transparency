<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        $user = $request->user();
        $isCitizen = $user !== null
            && strtolower(trim((string) $user->role)) === 'citizen';

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user?->only([
                    'name',
                    'email',
                    'role',
                ]),
            ],
            'notifications' => fn () => $isCitizen
                ? $user->notifications()
                    ->latest()
                    ->limit(10)
                    ->get()
                    ->map(fn ($notification) => [
                        'id' => $notification->id,
                        'data' => $notification->data,
                        'read_at' => $notification->read_at,
                        'created_at' => $notification->created_at,
                    ])
                : [],
            'unreadNotificationCount' => fn () => $isCitizen
                ? $user->unreadNotifications()->count()
                : 0,
            'citizenFeedbackProjects' => fn () => $isCitizen
                ? Project::query()
                    ->whereHas('feedback', fn ($query) => $query->where('user_id', $user->id))
                    ->orderBy('project_name')
                    ->get(['id', 'project_name'])
                : [],
        ]);
    }
}
