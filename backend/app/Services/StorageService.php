<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StorageService {
    protected string $disk;

    public function __construct()
    {
        $this->disk = config('filesystems.default', 'neon');
    }

    // upload
    public function upload(
        UploadedFile $file,
        string $directory='uploads'
    ):string
    {
        $path=$file->store($directory,$this->disk);

        if($path===false){
            throw new \RuntimeException('File upload failed. Could not store file to disk: '.$this->disk);
        }

        return $path;
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
    public function getUrl(?string $path): string
    {
        if (!$path) {
            return '';
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk($this->disk);

        return $disk->url($path);
    }
}