<?php

namespace App\Models;

use App\Services\StorageService;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['service_id','title','image','description'])]
class ServiceDetail extends Model
{
    use HasUuids;

    protected $appends = ['image_url'];
    
    public function getImageUrlAttribute()
    {
        $storageService=app(StorageService::class);
        return $storageService->getUrl($this->image);
    }

    public function service(){
        return $this->belongsTo(Service::class);
    }
}
