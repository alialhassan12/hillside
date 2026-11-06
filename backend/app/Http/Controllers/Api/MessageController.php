<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function send(Request $request){
        $validated=$request->validate([
            'name'=>['required','string','max:255'],
            'email'=>['required','email','max:255'],
            'subject'=>['required','string','max:255'],
            'phone'=>['nullable','string','max:20'],
            'message'=>['required','string']
        ]);

        $message=Message::create($validated);

        return response()->json([
            'message'=>'Message sent successfully',
            'data'=>$message
        ],201);
    }

    public function getMessages(){
        $search=request()->query('search','all');
        
        $messages=Message::when($search !== "all", function ($query) use ($search) {
                $query->where('name','like',"%$search%")
                    ->orWhere('email','like',"%$search%")
                    ->orWhere('message','like',"%$search%")
                    ->orWhere('subject','like',"%$search%")
                    ->orWhere('phone','like',"%$search%");
            })
            ->orderBy('created_at','desc')
            ->paginate(10);

        if($messages->isEmpty()){
            return response()->json([
                'message'=>'No messages found'
            ],404);
        }

        return response()->json([
            'data'=>$messages
        ]);
    }

    public function changeStatus(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:messages,id'],
            'status'=>['required','in:unread,read']
        ]);

        $message=Message::find($validated['id']);
        if(!$message){
            return response()->json([
                'message'=>'Message not found'
            ],404);
        }

        $message->status=$validated['status'];
        $message->save();

        return response()->json([
            'message'=>'Message status updated successfully',
            'data'=>$message
        ]);
    }

    public function delete($id){
        $message=Message::find($id);
        if(!$message){
            return response()->json([
                'message'=>'Message not found'
            ],404);
        }

        $message->delete();

        return response()->json([
            'message'=>'Message deleted successfully'
        ]);
    }
}
