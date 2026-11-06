<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\AboutStatsController;
use App\Http\Controllers\Api\AuthConreoller;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ServiceDetailsController;
use App\Http\Controllers\Api\ServicesController;
use App\Http\Controllers\Api\TestimonialsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('throttle:public-form')->post('/login',[AuthConreoller::class,'login']);


Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout',[AuthConreoller::class,'logout']);

    Route::middleware('throttle:public-form')->post('/users',[AuthConreoller::class,'getUsers']);
    Route::middleware('throttle:public-form')->post('/add-admin',[AuthConreoller::class,'addUser']);
    Route::middleware('throttle:public-form')->put('/edit-admin',[AuthConreoller::class,'editUser']);
    Route::middleware('throttle:public-form')->delete('/delete-admin/{id}',[AuthConreoller::class,'deleteUser']);


    Route::post('/hero',[HeroController::class,'store']);
    Route::put('/hero/update',[HeroController::class,'update']);
    
    Route::post("/about",[AboutController::class,'store']);
    Route::put("/about/update",[AboutController::class,'update']);
    
    Route::post("/about-stats",[AboutStatsController::class,'store']);
    Route::put("/about-stats/update",[AboutStatsController::class,'update']);

    Route::post("/contact",[ContactController::class,'store']);
    Route::put("/contact/update",[ContactController::class,'update']);
    Route::delete("/contact/delete/{id}",[ContactController::class,'delete']);
    
    Route::post("/company/address",[CompanyController::class,'storeAddress']);
    Route::put("/company/address/update",[CompanyController::class,'updateAddress']);
    Route::post("/company/contact-banner",[CompanyController::class,'storeContactBanner']);
    Route::put("/company/contact-banner/update",[CompanyController::class,'updateContactBanner']);
    Route::post("/company/services-banner",[CompanyController::class,'storeServicesBanner']);
    Route::put("/company/services-banner/update",[CompanyController::class,'updateServicesBanner']);

    Route::post("/services",[ServicesController::class,'store']);
    Route::put("/services/update",[ServicesController::class,'update']);
    Route::delete("/services/delete/{id}",[ServicesController::class,'delete']);

    Route::post("/services/details",[ServiceDetailsController::class,'store']);
    Route::put("/services/details/update",[ServiceDetailsController::class,'update']);
    Route::delete("/services/details/delete/{id}",[ServiceDetailsController::class,'delete']);
    
    Route::post("/gallery/images",[GalleryController::class,'storeImage']);
    Route::delete("/gallery/images/delete/{id}",[GalleryController::class,'delete']);
    Route::post("/gallery/video",[GalleryController::class,'storeVideo']);
    Route::put("/gallery/video/update",[GalleryController::class,'updateVideo']);
    Route::put("/gallery/video/thumbnail/update",[GalleryController::class,'updateVideoThumbnail']);

    Route::get("/messages",[MessageController::class,'getMessages']);
    Route::put("/messages/status/change",[MessageController::class,'changeStatus']);
    Route::delete("/messages/delete/{id}",[MessageController::class,'delete']);

    Route::get("/testimonials",[TestimonialsController::class,'getTestimonials']);
    Route::put("/testimonials/status/change",[TestimonialsController::class,'changeStatus']);
    Route::put("/testimonials/visibility/change",[TestimonialsController::class,'changeVisibility']);
    Route::delete("/testimonials/delete/{id}",[TestimonialsController::class,'deleteTestimonial']);
    
    Route::get("/dashboard",[DashboardController::class,'dashboardData']);
});
    
Route::get("/testimonials/public",[TestimonialsController::class,'getPublicTestimonials']);

Route::get('/hero',[HeroController::class,'getHero']);

Route::get("/about",[AboutController::class,'getAbouts']);

Route::get("/about-stats",[AboutStatsController::class,'getAboutStats']);

Route::get("/contact",[ContactController::class,'getContacts']);

Route::get("/company/address",[CompanyController::class,'getAddress']);

Route::get("/company/contact-banner",[CompanyController::class,'getContactBanner']);

Route::get("/company/services-banner",[CompanyController::class,'getServicesBanner']);

Route::get("/services",[ServicesController::class,'getServices']);

Route::get("/services/details/{id}",[ServiceDetailsController::class,'getServiceDetails']);

Route::get("/gallery/images",[GalleryController::class,'getGallery']);

Route::get("/gallery/video",[GalleryController::class,'getVideo']);

Route::middleware('throttle:public-form')->post("/messages/send",[MessageController::class,'send']);

Route::middleware('throttle:public-form')->post("/feedback/send",[TestimonialsController::class,'send']);

Route::get("/footer",[ContactController::class,'fetchFooterData']);
