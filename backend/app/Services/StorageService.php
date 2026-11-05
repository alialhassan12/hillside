<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StorageService {
    protected string $disk;

    public function __construct()
    {
        $this->disk=config('filesystem.default');
    }

    // upload
    public function upload(
        UploadedFile $file,
        string $directory='uploads'
    ):string
    {
        return $file->store($directory,$this->disk);
    }

    // delete
    public function delete(
        string $path
    ):bool
    {
        if(!$path){
            return false;
        }

        return Storage::disk($this->disk)->delete($path);
    }

    // get public url
    public function getUrl(string $path):string{
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk($this->disk);

        return $disk->url($path);
    }
}