<?php

use App\Http\Controllers\Api\HeroController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/hero',[HeroController::class,'store']);
Route::get('/hero',[HeroController::class,'getHero']);

Route::put('/hero/update',[HeroController::class,'update']);