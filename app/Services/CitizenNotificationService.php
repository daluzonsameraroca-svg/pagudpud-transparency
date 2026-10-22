<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Notification as NotificationFacade;

class CitizenNotificationService
{
    public function sendToCitizens(Notification $notification): void
    {
        User::query()
            ->where('role', 'citizen')
            ->chunkById(100, function ($citizens) use ($notification) {
                NotificationFacade::send($citizens, $notification);
            });
    }
}
