<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StorageService;
use App\Models\Hero;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function __construct(
        protected StorageService $storage
    )
    {}


    public function store(Request $request){
        $validated=$request->validate([
            'title'=>['required','string','max:255'],
            'subTitle'=>['required','string','max:255'],
            'image'=>['required','image','max:2048']
        ]);

        $existingHero=Hero::first();
        if($existingHero){
            return response()->json([
                'message'=>'Hero already exists. Please update the existing hero instead.'
            ],400);
        }

        $imagePath=$this->storage->upload($validated['image'],'hero');

        $hero=Hero::create([
            'title'=>$validated['title'],
            'subTitle'=>$validated['subTitle'],
            'image'=>$imagePath
        ]);

        return response()->json([
            'message'=>'Hero created successfully',
            'data'=>$hero
        ],201);
    }

    public function getHero(){
        $hero=Hero::first();
        if(!$hero){
            return response()->json([
                'message'=>'No hero found'
            ],404);
        }

        return response()->json([
            'message'=>'Hero retrieved successfully',
            'data'=>$hero
        ],200);
    }

    public function update(Request $request){
        $validated=$request->validate([
            'title'=>['sometimes','string','max:255'],
            'subTitle'=>['sometimes','string','max:255'],
            'image'=>['sometimes','image','max:2048']
        ]);

        $hero=Hero::first();
        if(!$hero){
            return response()->json([
                'message'=>'No hero found'
            ],404);
        }

        if(isset($validated['image'])){
            // delete old image
            $this->storage->delete($hero->image);
            // upload new image
            $imagePath=$this->storage->upload($validated['image'],'hero');
            $validated['image']=$imagePath;
        }

        $hero->update($validated);

        return response()->json([
            'message'=>'Hero updated successfully',
            'data'=>$hero
        ],200);
    }
}