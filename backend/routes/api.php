<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\AboutStatsController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\ServiceDetailsController;
use App\Http\Controllers\Api\ServicesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/hero',[HeroController::class,'store']);
Route::get('/hero',[HeroController::class,'getHero']);

Route::put('/hero/update',[HeroController::class,'update']);

Route::post("/about",[AboutController::class,'store']);
Route::get("/about",[AboutController::class,'getAbouts']);
Route::put("/about/update",[AboutController::class,'update']);

Route::post("/about-stats",[AboutStatsController::class,'store']);
Route::get("/about-stats",[AboutStatsController::class,'getAboutStats']);
Route::put("/about-stats/update",[AboutStatsController::class,'update']);


Route::post("/contact",[ContactController::class,'store']);
Route::get("/contact",[ContactController::class,'getContacts']);
Route::put("/contact/update",[ContactController::class,'update']);
Route::delete("/contact/delete/{id}",[ContactController::class,'delete']);

Route::post("/company/address",[CompanyController::class,'storeAddress']);
Route::get("/company/address",[CompanyController::class,'getAddress']);
Route::put("/company/address/update",[CompanyController::class,'updateAddress']);

Route::post("/company/contact-banner",[CompanyController::class,'storeContactBanner']);
Route::get("/company/contact-banner",[CompanyController::class,'getContactBanner']);
Route::put("/company/contact-banner/update",[CompanyController::class,'updateContactBanner']);

Route::post("/company/services-banner",[CompanyController::class,'storeServicesBanner']);
Route::get("/company/services-banner",[CompanyController::class,'getServicesBanner']);
Route::put("/company/services-banner/update",[CompanyController::class,'updateServicesBanner']);

Route::post("/services",[ServicesController::class,'store']);
Route::get("/services",[ServicesController::class,'getServices']);
Route::put("/services/update",[ServicesController::class,'update']);
Route::delete("/services/delete/{id}",[ServicesController::class,'delete']);


Route::post("/services",[ServicesController::class,'store']);
Route::get("/services",[ServicesController::class,'getServices']);
Route::put("/services/update",[ServicesController::class,'update']);
Route::delete("/services/delete/{id}",[ServicesController::class,'delete']);

Route::post("/services/details",[ServiceDetailsController::class,'store']);
Route::get("/services/details/{id}",[ServiceDetailsController::class,'getServiceDetails']);
Route::put("/services/details/update",[ServiceDetailsController::class,'update']);
Route::delete("/services/details/delete/{id}",[ServiceDetailsController::class,'delete']);