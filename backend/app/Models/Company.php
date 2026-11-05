<?php

namespace App\Models;

use App\Services\StorageService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['address', 'address_icon', 'contact_banner_img', 'services_banner_img'])]

class Company extends Model
{
    use HasUuids;

    protected $appends = ['address_icon_url','contact_banner_img_url','services_banner_img_url'];
    public function getAddressIconUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $this->address_icon ? $storageService->getUrl($this->address_icon) : '';
    }

    public function getContactBannerImgUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $this->contact_banner_img ? $storageService->getUrl($this->contact_banner_img) : '';
    }

    public function getServicesBannerImgUrlAttribute(): string
    {
        $storageService = app(StorageService::class);
        return $this->services_banner_img ? $storageService->getUrl($this->services_banner_img) : '';
    }
}
