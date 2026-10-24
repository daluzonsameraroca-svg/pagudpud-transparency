<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_name',
        'description',
        'implementing_office',
        'contractor',
        'location',
        'latitude',
        'longitude',
        'image_path',
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
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'start_date' => 'date',
            'target_completion_date' => 'date',
            'progress' => 'integer',
        ];
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path
            ? Storage::disk(config('filesystems.upload_disk', 'public'))
                ->url($this->image_path)
            : null;
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
