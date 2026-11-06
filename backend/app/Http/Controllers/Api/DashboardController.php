<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Message;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboardData(Request $request){
        $totalServices=Service::count();

        $pendingFeedbacks=Testimonial::where('status','pending')->count();

        $unreadMessages=Message::where('status','unread')->count();

        $galleryCount=Gallery::count();

        $topFeedbacks=Testimonial::orderBy('created_at','desc')->take(5)->get();



        return response()->json([
            'total_services'=>$totalServices,
            'pending_feedbacks'=>$pendingFeedbacks,
            'unread_messages'=>$unreadMessages,
            'gallery_count'=>$galleryCount,
            'top_feedbacks'=>$topFeedbacks
        ]);
    }
}
