<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'representation', 'feedback', 'profile'])]
class Testimonial extends Model
{
    use HasUuids;

    protected $appends = ['profile_url'];
    public function getProfileUrlAttribute(): string
    {
        $storageService = app(\App\Services\StorageService::class);
        return $this->profile ? $storageService->getUrl($this->profile) : '';
    }
}
