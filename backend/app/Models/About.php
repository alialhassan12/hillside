<?php

namespace App\Models;

use App\Services\StorageService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'icon', 'text','image'])]
class About extends Model
{
    use HasUuids;

    protected $appends = ['icon_url','image_url'];
    public function getIconUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $storageService->getUrl($this->icon);
    }

    public function getImageUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $storageService->getUrl($this->image);
    }
}
