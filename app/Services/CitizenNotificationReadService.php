<?php

namespace App\Services;

use App\Models\User;

class CitizenNotificationReadService
{
    public function markProjectNotificationsAsRead(
        User $user,
        ?int $projectId = null,
    ): void {
        $notificationIds = $user->unreadNotifications()
            ->get()
            ->filter(function ($notification) use ($projectId) {
                $notificationProjectId = $notification->data['project_id'] ?? null;

                return $notificationProjectId !== null
                    && ($projectId === null
                        || (int) $notificationProjectId === $projectId);
            })
            ->modelKeys();

        $this->markNotificationsAsRead($user, $notificationIds);
    }

    public function markAnnouncementNotificationsAsRead(User $user): void
    {
        $notificationIds = $user->unreadNotifications()
            ->get()
            ->filter(fn ($notification) => in_array(
                $notification->data['type'] ?? null,
                ['announcement', 'announcement_updated'],
                true,
            ))
            ->modelKeys();

        $this->markNotificationsAsRead($user, $notificationIds);
    }

    private function markNotificationsAsRead(
        User $user,
        array $notificationIds,
    ): void {
        if ($notificationIds === []) {
            return;
        }

        $user->notifications()
            ->whereKey($notificationIds)
            ->update(['read_at' => now()]);
    }
}
