<?php

namespace App\Models;

use App\Services\StorageService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'icon', 'description'])]
class Service extends Model
{
    use HasUuids;

    protected $appends = ['icon_url'];
    public function getIconUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $storageService->getUrl($this->icon);
    }

    public function serviceDetails()
    {
        return $this->hasMany(ServiceDetail::class);
    }
}
