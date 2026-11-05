<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Services\StorageService;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function __construct(
        protected StorageService $storage
    )
    {}

    public function store(Request $request){
        $validated=$request->validate([
            'title'=>['required','string','max:255'],
            'icon'=>['required','image','max:1048'],
            'text'=>['required','string'],
            'image'=>['required','image','max:2048']
        ]);

        $existingAboutCount=About::count();
        if($existingAboutCount == 2){
            return response()->json([
                'message'=>'About already exists. Please update the existing about instead.'
            ],400);
        }
        
        $iconPath=$this->storage->upload($validated['icon'],'about');
        $imgPath=$this->storage->upload($validated['image'],'about');
        
        $validated['icon']=$iconPath;
        $validated['image']=$imgPath;

        $about=About::create($validated);

        return response()->json([
            'message'=>'About created successfully',
            'data'=>$about
        ],201);
    }

    public function getAbouts(){
        $abouts=About::all();

        if($abouts->isEmpty()){
            return response()->json([
                'message'=>'No abouts found'
            ],404);
        }

        return response()->json([
            'message'=>'Abouts retrieved successfully',
            'data'=>$abouts
        ],200);
    }

    public function update(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:abouts,id'],
            'title'=>['sometimes','string','max:255'],
            'icon'=>['sometimes','image','max:1048'],
            'image'=>['sometimes','image','max:2048'],
            'text'=>['sometimes','string']
        ]);

        $about=About::find($validated['id']);
        if(!$about){
            return response()->json([
                'message'=>'About not found'
            ],404);
        }

        if($request->hasFile('icon')){
            $this->storage->delete($about->icon);
            $iconPath=$this->storage->upload($validated['icon'],'about');
            $validated['icon']=$iconPath;
        }

        if($request->hasFile('image')){
            $this->storage->delete($about->image);
            $imgPath=$this->storage->upload($validated['image'],'about');
            $validated['image']=$imgPath;
        }

        $about->update($validated);

        return response()->json([
            'message'=>'About updated successfully',
            'data'=>$about
        ],200);
    }
}
