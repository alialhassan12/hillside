<?php

namespace App\Models;

use App\Services\StorageService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['video_path', 'thumbnail_path'])]
class Video extends Model
{
    use HasUuids;

    protected $appends = ['video_url', 'thumbnail_url'];

    public function getVideoUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $storageService->getUrl($this->video_path);
    }

    public function getThumbnailUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $storageService->getUrl($this->thumbnail_path);
    }
}
