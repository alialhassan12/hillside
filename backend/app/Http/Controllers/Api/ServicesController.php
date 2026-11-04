<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\StorageService;
use Illuminate\Http\Request;

class ServicesController extends Controller
{
    public function __construct(
        protected StorageService $storage
    )
    {}

    public function store(Request $request){
        $validated=$request->validate([
            'name'=>['required','string','max:255'],
            'description'=>['required','string'],
            'icon'=>['required','image','max:1048']
        ]);

        $iconPath=$this->storage->upload($validated['icon'],'services');
        $validated['icon']=$iconPath;

        $service=Service::create($validated);

        return response()->json([
            'message'=>'Service created successfully',
            'data'=>$service
        ],201);
    }

    public function getServices(){
        $services=Service::all();

        if($services->isEmpty()){
            return response()->json([
                'message'=>'No services found'
            ],404);
        }

        return response()->json([
            'message'=>'Services retrieved successfully',
            'data'=>$services
        ],200);
    }

    public function update(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:services,id'],
            'name'=>['sometimes','string','max:255'],
            'description'=>['sometimes','string'],
            'icon'=>['sometimes','image','max:1048']
        ]);

        $service=Service::find($validated['id']);
        if(!$service){
            return response()->json([
                'message'=>'Service not found'
            ],404);
        }

        if(isset($validated['icon'])){
            $this->storage->delete($service->icon);
            $iconPath=$this->storage->upload($validated['icon'],'services');
            $validated['icon']=$iconPath;
        }

        $service->update($validated);

        return response()->json([
            'message'=>'Service updated successfully',
            'data'=>$service
        ],200);
    }

    public function delete($id){
        $service=Service::find($id);

        if(!$service){
            return response()->json([
                'message'=>'Service not found'
            ],404);
        }

        $this->storage->delete($service->icon);
        $service->delete();

        return response()->json([
            'message'=>'Service deleted successfully'
        ],200);
    }
}
