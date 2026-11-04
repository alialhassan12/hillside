<?php

namespace App\Models;

use App\Services\StorageService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'link', 'icon'])]
class Contact extends Model
{
    use HasUuids;

    protected $appends = ['icon_url'];
    public function getIconUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $storageService->getUrl($this->icon);
    }
}
