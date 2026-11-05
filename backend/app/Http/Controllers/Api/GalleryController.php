<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Video;
use App\Services\StorageService;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function __construct(
        protected StorageService $storage
    )
    {}

    public function storeImage(Request $request){
        $validated=$request->validate([
            'path'=>['required','image','max:1048']
        ]);

        $path=$this->storage->upload($validated['path'],'gallery');
        $validated['path']=$path;

        $gallery=Gallery::create($validated);

        return response()->json([
            'message'=>'Gallery image uploaded successfully',
            'data'=>$gallery
        ],201);
    }

    public function getGallery(){
        $gallery=Gallery::all();

        if($gallery->isEmpty()){
            return response()->json([
                'message'=>'No gallery images found'
            ],404);
        }

        return response()->json([
            'message'=>'Gallery images retrieved successfully',
            'data'=>$gallery
        ],200);
    }

    public function delete($id){
        $gallery=Gallery::find($id);
        if(!$gallery){
            return response()->json([
                'message'=>'Gallery image not found'
            ],404);
        }

        $this->storage->delete($gallery->path);

        $gallery->delete();

        return response()->json([
            'message'=>'Gallery image deleted successfully'
        ],200);
    }

    public function storeVideoThumbnail(Request $request){
        $validated=$request->validate([
            'thumbnail_path'=>['required','image','max:1048']
        ]);

        $videoExisting=Video::first();
        if($videoExisting){
            return response()->json([
                'message'=>'Video already exists. Please update the existing video instead of uploading a new one.'
            ],400);
        }

        $thumbnailPath=$this->storage->upload($validated['thumbnail_path'],'thumbnails');

        $validated['thumbnail_path']=$thumbnailPath;

        $video=Video::create($validated);

        return response()->json([
            'message'=>'Video and thumbnail uploaded successfully',
            'data'=>$video
        ],201);
    }

    public function storeVideo(Request $request){
        $validated=$request->validate([
            'video_path'=>['required','file','mimetypes:video/mp4,video/avi,video/mpeg,video/quicktime'],
        ]);

        $videoExisting=Video::first();
        if($videoExisting){
            return response()->json([
                'message'=>'Video already exists. Please update the existing video instead of uploading a new one.'
            ],400);
        }

        $videoPath=$this->storage->upload($validated['video_path'],'videos');

        $validated['video_path']=$videoPath;

        $video=Video::create($validated);

        return response()->json([
            'message'=>'Video and thumbnail uploaded successfully',
            'data'=>$video
        ],201);
    }

    public function getVideo(){
        $video=Video::first();

        if(!$video){
            return response()->json([
                'message'=>'No video found'
            ],404);
        }

        return response()->json([
            'message'=>'Video retrieved successfully',
            'data'=>$video
        ],200);
    }

    public function updateVideoThumbnail(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:videos,id'],
            'thumbnail_path'=>['required','image','max:1048']
        ]);

        $video=Video::find($validated['id']);
        if(!$video){
            return response()->json([
                'message'=>'Video not found'
            ],404);
        }

        $this->storage->delete($video->thumbnail_path);

        $thumbnailPath=$this->storage->upload($validated['thumbnail_path'],'thumbnails');

        $video->update(['thumbnail_path'=>$thumbnailPath]);

        return response()->json([
            'message'=>'Video thumbnail updated successfully',
            'data'=>$video
        ],200);
    }

    public function updateVideo(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:videos,id'],
            'video_path'=>['required','file','mimetypes:video/mp4,video/avi,video/mpeg,video/quicktime'],
        ]);

        $video=Video::find($validated['id']);
        if(!$video){
            return response()->json([
                'message'=>'Video not found'
            ],404);
        }

        $this->storage->delete($video->video_path);

        $videoPath=$this->storage->upload($validated['video_path'],'videos');

        $video->update(['video_path'=>$videoPath]);

        return response()->json([
            'message'=>'Video updated successfully',
            'data'=>$video
        ],200);
    }
}
