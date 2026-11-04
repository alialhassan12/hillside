<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutStat;
use Illuminate\Http\Request;

class AboutStatsController extends Controller
{
    public function store(Request $request){
        $validated=$request->validate([
            'title'=>['required','string','max:255'],
            'description'=>['required','string']
        ]);

        $existingAboutStatCount=AboutStat::count();
        if($existingAboutStatCount == 4){
            return response()->json([
                'message'=>'About stats already exists. Please update the existing about stats instead.'
            ],400);
        }

        $aboutStat=AboutStat::create($validated);

        return response()->json([
            'message'=>'About stat created successfully',
            'data'=>$aboutStat
        ],201);
    }

    public function getAboutStats(){
        $aboutStats=AboutStat::all();

        if($aboutStats->isEmpty()){
            return response()->json([
                'message'=>'No about stats found'
            ],404);
        }

        return response()->json([
            'message'=>'About stats retrieved successfully',
            'data'=>$aboutStats
        ],200);
    }

    public function update(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:about_stats,id'],
            'title'=>['sometimes','string','max:255'],
            'description'=>['sometimes','string']
        ]);

        $aboutStat=AboutStat::find($validated['id']);
        if(!$aboutStat){
            return response()->json([
                'message'=>'About stat not found'
            ],404);
        }

        $aboutStat->update($validated);

        return response()->json([
            'message'=>'About stat updated successfully',
            'data'=>$aboutStat
        ],200);
    }
}
