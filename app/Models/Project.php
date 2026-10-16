<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProjectProgressUpdate;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_name',
        'description',
        'location',
        'budget',
        'start_date',
        'target_completion_date',
        'status',
        'progress',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'decimal:2',
            'start_date' => 'date',
            'target_completion_date' => 'date',
            'progress' => 'integer',
        ];
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }

    public function progressUpdates()
    {
        return $this->hasMany(ProjectProgressUpdate::class);
    }
}