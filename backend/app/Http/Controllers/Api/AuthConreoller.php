<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthConreoller extends Controller
{
    public function login(Request $request){
        $validated=$request->validate([
            'username'=>['required','max:255'],
            'password'=>['required','string','min:8']
        ]);

        $user=User::where('username',$validated['username'])->first();

        if(!$user || !Hash::check($validated['password'],$user->password)){
            return response()->json([
                'message'=>'Invalid credentials'
            ],401);
        }

        $token=$user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message'=>'Login successful',
            'token'=>$token,
            'user'=>$user
        ]);
    }

    public function logout(Request $request){
        $user=$request->user();
        if(!$user){
            return response()->json([
                'message'=>'User not authenticated'
            ],401);
        }

        $user->currentAccessToken()->delete();

        return response()->json([
            'message'=>'Logout successful'
        ]);
    }

    public function addUser(Request $request){
        $validated=$request->validate([
            'username'=>['required','max:255','unique:users,username'],
            'password'=>['required','string','min:8']
        ]);

        $user=User::create($validated);

        return response()->json([
            'message'=>'User created successfully',
            'user'=>$user
        ],201);
    }

    public function getUsers(Request $request){
        
        $users=User::all();

        return response()->json([
            'users'=>$users
        ]);
    }

    public function deleteUser($id){
        $user=User::find($id);

        $usersCount=User::count();
        
        if($usersCount <= 1){
            return response()->json([
                'message'=>'Cannot delete the last user'
            ],403);
        }
        
        if(!$user){
            return response()->json([
                'message'=>'User not found'
            ],404);
        }

        $user->delete();

        return response()->json([
            'message'=>'User deleted successfully'
        ]);
    }

    public function editUser(Request $request){
        $validated=$request->validate([
            'id'=>['required','uuid','exists:users,id'],
            'username'=>['sometimes','string','max:255','unique:users,username'],
            'password'=>['sometimes','string','min:8']
        ]);

        $user=User::find($validated['id']);
        if(!$user){
            return response()->json([
                'message'=>'User not found'
            ],404);
        }

        $user->update($validated);

        return response()->json([
            'message'=>'User updated successfully',
            'user'=>$user
        ]);
    }
}
