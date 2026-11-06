<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceDetail;
use App\Services\StorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceDetailsController extends Controller
{
    public function __construct(
        protected StorageService $storage
    )
    {}

    public function store(Request $request){
        $validated=$request->validate([
            'service_id'=>['required','uuid','exists:services,id'],
            'title'=>['required','string','max:255'],
            'description'=>['required','string'],
            'image'=>['nullable','image','max:1048']
        ]);

        if(isset($validated['image'])){
            $imagePath=$this->storage->upload($validated['image'],'service_details');
            $validated['image']=$imagePath;
        }else{
            $validated['image']=null;
        }

        $serviceDetail=ServiceDetail::create($validated);

        return response()->json([
            'message'=>'Service detail created successfully',
            'data'=>$serviceDetail
        ],201);
    }

    public function getServiceDetails($id){
        Log::info("Fetching service details for service ID: $id");
        $serviceDetails = ServiceDetail::where('service_id', $id)->get();

        if($serviceDetails->isEmpty()){
            return response()->json([
                'message'=>'No service details found'
            ],404);
        }

        return response()->json([
            'message'=>'Service details retrieved successfully',
            'data'=>$serviceDetails
        ],200);
    }

    public function update(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:service_details,id'],
            'title'=>['sometimes','string','max:255'],
            'description'=>['sometimes','string'],
            'image'=>['sometimes','image','max:1048']
        ]);

        $serviceDetail=ServiceDetail::find($validated['id']);
        if(!$serviceDetail){
            return response()->json([
                'message'=>'Service detail not found'
            ],404);
        }

        if(isset($validated['image'])){
            $this->storage->delete($serviceDetail->image);
            $imagePath=$this->storage->upload($validated['image'],'service_details');
            $validated['image']=$imagePath;
        }

        $serviceDetail->update($validated);

        return response()->json([
            'message'=>'Service detail updated successfully',
            'data'=>$serviceDetail
        ],200);
    }

    public function delete($id){
        $serviceDetail=ServiceDetail::find($id);
        if(!$serviceDetail){
            return response()->json([
                'message'=>'Service detail not found'
            ],404);
        }

        $this->storage->delete($serviceDetail->image);
        $serviceDetail->delete();

        return response()->json([
            'message'=>'Service detail deleted successfully'
        ],200);
    }
}
