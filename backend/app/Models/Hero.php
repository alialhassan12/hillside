<?php

namespace App\Models;

use App\Services\StorageService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title','subTitle','image'])]

class Hero extends Model
{
    use HasUuids;

    protected $appends = ['image_url'];
    public function getImageUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $storageService->getUrl($this->image);
    }
}
