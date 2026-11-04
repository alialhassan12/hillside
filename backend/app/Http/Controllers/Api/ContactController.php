<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Services\StorageService;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function __construct(
        protected StorageService $storage
    )
    {}

    public function store(Request $request){
        $validated=$request->validate([
            'name'=>['required','string','max:255'],
            'link'=>['required','string','max:255'],
            'icon'=>['required','image','max:1048']
        ]);

        $iconPath=$this->storage->upload($validated['icon'],'contact');
        $validated['icon']=$iconPath;

        $contact=Contact::create($validated);

        return response()->json([
            'message'=>'Contact created successfully',
            'data'=>$contact
        ],201);
    }

    public function getContacts(){
        $contacts=Contact::all();

        if($contacts->isEmpty()){
            return response()->json([
                'message'=>'No contacts found'
            ],404);
        }

        return response()->json([
            'message'=>'Contacts retrieved successfully',
            'data'=>$contacts
        ],200);
    }

    public function update(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:contacts,id'],
            'name'=>['sometimes','string','max:255'],
            'link'=>['sometimes','string','max:255'],
            'icon'=>['sometimes','image','max:1048']
        ]);

        $contact=Contact::find($validated['id']);
        if(!$contact){
            return response()->json([
                'message'=>'Contact not found'
            ],404);
        }

        if(isset($validated['icon'])){
            $this->storage->delete($contact->icon);
            $iconPath=$this->storage->upload($validated['icon'],'contact');
            $validated['icon']=$iconPath;
        }

        $contact->update($validated);

        return response()->json([
            'message'=>'Contact updated successfully',
            'data'=>$contact
        ],200);
    }

    public function delete($id){
        $contact=Contact::find($id);
        
        if(!$contact){
            return response()->json([
                'message'=>'Contact not found'
            ],404);
        }

        $this->storage->delete($contact->icon);
        $contact->delete();

        return response()->json([
            'message'=>'Contact deleted successfully'
        ],200);
    }
}
