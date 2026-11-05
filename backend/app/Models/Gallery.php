<?php

namespace App\Models;

use App\Services\StorageService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['path'])]
class Gallery extends Model
{
    use HasUuids;

    protected $appends = ['path_url'];

    public function getPathUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $storageService->getUrl($this->path);
    }
}
