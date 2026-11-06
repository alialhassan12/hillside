<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Services\StorageService;
use Illuminate\Http\Request;

class TestimonialsController extends Controller
{
    public function __construct(
        protected StorageService $storage
    )
    {}

    public function send(Request $request){
        $validated=$request->validate([
            'name'=>['required','string','max:255'],
            'representation'=>['nullable','string','max:255'],
            'feedback'=>['required','string'],
            'profile'=>['nullable','image','max:1048']
        ]);

        if($request->hasFile('profile')){
            $profilePath=$this->storage->upload($validated['profile'],'testimonials');
            $validated['profile']=$profilePath;
        }

        $testimonial=Testimonial::create($validated);

        return response()->json([
            'message'=>'Testimonial submitted successfully',
            'data'=>$testimonial
        ],201);
    }

    public function getTestimonials(){
        $search=request()->query('search','all');
        $status=request()->query('status','all');
        $visibility=request()->query('visibility',null);

        $testimonials=Testimonial::when($status!=='all',function($query) use ($status){
            $query->where('status',$status);
        })
        ->when($search!=='all',function($query) use ($search){
            $query->where(function($q) use ($search){
                $q->where('name','like',"%$search%")
                ->orWhere('representation','like',"%$search%")
                ->orWhere('feedback','like',"%$search%");
            });
        })
        ->when($visibility!==null,function($query) use ($visibility){
            $query->where('is_shown',$visibility);
        })
        ->orderBy('created_at','desc')
        ->paginate(10);

        if($testimonials->isEmpty()){
            return response()->json([
                'message'=>'No testimonials found'
            ],404);
        }

        return response()->json([
            'message'=>'Testimonials retrieved successfully',
            'data'=>$testimonials
        ],200);
    }

    public function getPublicTestimonials(){
        $testimonials=Testimonial::where('is_shown',true)
            ->where('status','approved')
            ->orderBy('created_at','desc')
            ->get();

        if(!$testimonials){
            return response()->json([
                'message'=>'No testimonials found'
            ],404);
        }

        return response()->json([
            'message'=>'Testimonials retrieved successfully',
            'data'=>$testimonials
        ],200);
    }

    public function changeStatus(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:testimonials,id'],
            'status'=>['required','in:pending,approved,rejected']
        ]);

        $testimonial=Testimonial::find($validated['id']);
        if(!$testimonial){
            return response()->json([
                'message'=>'Testimonial not found'
            ],404);
        }

        $testimonial->status=$validated['status'];
        $testimonial->save();

        return response()->json([
            'message'=>'Testimonial status updated successfully',
            'data'=>$testimonial
        ],200);
    }

    public function changeVisibility(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:testimonials,id'],
            'is_shown'=>['required','boolean']
        ]);

        $testimonial=Testimonial::find($validated['id']);
        if(!$testimonial){
            return response()->json([
                'message'=>'Testimonial not found'
            ],404);
        }

        if($testimonial->status!=='approved'){
            return response()->json([
                'message'=>'Only approved testimonials can be shown'
            ],400);
        }

        $testimonial->is_shown=$validated['is_shown'];
        $testimonial->save();

        return response()->json([
            'message'=>'Testimonial visibility updated successfully',
            'data'=>$testimonial
        ],200);
    }

    public function deleteTestimonial($id){
        $testimonial=Testimonial::find($id);
        if(!$testimonial){
            return response()->json([
                'message'=>'Testimonial not found'
            ],404);
        }
        if($testimonial->status !== 'rejected'){
            return response()->json([
                'message'=>'Only rejected testimonials can be deleted'
            ],400);
        }
        
        $testimonial->delete();
        return response()->json([
            'message'=>'Testimonial deleted successfully'
        ],200);
    }
}
