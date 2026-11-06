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
}
