<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';

    public const STATUS_PENDING = 'Pending';
    public const STATUS_REVIEWED = 'Reviewed';
    public const STATUS_RESOLVED = 'Resolved';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_REVIEWED,
        self::STATUS_RESOLVED,
    ];

    protected $fillable = [
        'user_id',
        'project_id',
        'message',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
