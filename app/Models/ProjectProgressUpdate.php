<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectProgressUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'status',
        'progress',
        'update_description',
        'update_date',
        'image_path',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'progress' => 'integer',
            'update_date' => 'date',
        ];
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path
            ? route('media.public', ['path' => $this->image_path], false)
            : null;
    }
}
