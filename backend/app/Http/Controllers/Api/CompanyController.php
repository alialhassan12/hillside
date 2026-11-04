<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Services\StorageService;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function __construct(
        protected StorageService $storage
    )
    {}

    public function storeAddress(Request $request){
        $validated=$request->validate([
            'address'=>['required','string','max:255'],
            'address_icon'=>['required','image','max:1048']
        ]);

        $addressIconPath=$this->storage->upload($validated['address_icon'],'company');
        $validated['address_icon']=$addressIconPath;

        $company=Company::create($validated);

        return response()->json([
            'message'=>'Company address created successfully',
            'data'=>$company
        ],201);
    }

    public function storeContactBanner(Request $request){
        $validated=$request->validate([
            'contact_banner_img'=>['required','image','max:5048']
        ]);

        $company=Company::first();
        if($company){
            return response()->json([
                'message'=>'Company contact banner already exists. Please update the existing contact banner instead.'
            ],400);
        }

        $contactBannerPath=$this->storage->upload($validated['contact_banner_img'],'company');
        $validated['contact_banner_img']=$contactBannerPath;
        
        $company=Company::create($validated);

        return response()->json([
            'message'=>'Company contact banner created successfully',
            'data'=>$company
        ],200);
    }

    public function storeServicesBanner(Request $request){
        $validated=$request->validate([
            'services_banner_img'=>['required','image','max:5048']
        ]);

        $company=Company::first();
        if($company){
            return response()->json([
                'message'=>'Company services banner already exists. Please update the existing services banner instead.'
            ],400);
        }

        $servicesBannerPath=$this->storage->upload($validated['services_banner_img'],'company');
        $validated['services_banner_img']=$servicesBannerPath;

        $company=Company::create($validated);

        return response()->json([
            'message'=>'Company services banner created successfully',
            'data'=>$company
        ],200);
    }

    public function updateAddress(Request $request){
        $validated=$request->validate([
            'address'=>['sometimes','string','max:255'],
            'address_icon'=>['sometimes','image','max:1048']
        ]);

        $company=Company::first();
        if(!$company){
            return response()->json([
                'message'=>'No company address found'
            ],404);
        }

        if(isset($validated['address_icon'])){
            $this->storage->delete($company->address_icon);
            $addressIconPath=$this->storage->upload($validated['address_icon'],'company');
            $validated['address_icon']=$addressIconPath;
        }

        $company->update($validated);

        return response()->json([
            'message'=>'Company address updated successfully',
            'data'=>$company
        ],200);
    }

    public function updateContactBanner(Request $request){
        $validated=$request->validate([
            'contact_banner_img'=>['sometimes','image','max:5048']
        ]);

        $company=Company::first();
        if(!$company){
            return response()->json([
                'message'=>'No company contact banner found'
            ],404);
        }

        if(isset($validated['contact_banner_img'])){
            if($company->contact_banner_img) {
                $this->storage->delete($company->contact_banner_img);
            }
            $contactBannerPath=$this->storage->upload($validated['contact_banner_img'],'company');
            $validated['contact_banner_img']=$contactBannerPath;
        }

        $company->update($validated);

        return response()->json([
            'message'=>'Company contact banner updated successfully',
            'data'=>$company
        ],200);
    }

    public function updateServicesBanner(Request $request){
        $validated=$request->validate([
            'services_banner_img'=>['sometimes','image','max:5048']
        ]);

        $company=Company::first();
        if(!$company){
            return response()->json([
                'message'=>'No company services banner found'
            ],404);
        }

        if(isset($validated['services_banner_img'])){
            if($company->services_banner_img) {
                $this->storage->delete($company->services_banner_img);
            }
            $servicesBannerPath=$this->storage->upload($validated['services_banner_img'],'company');
            $validated['services_banner_img']=$servicesBannerPath;
        }

        $company->update($validated);

        return response()->json([
            'message'=>'Company services banner updated successfully',
            'data'=>$company
        ],200);
    }

    public function getAddress(){
        $company=Company::select('address','address_icon')->first();
        if(!$company){
            return response()->json([
                'message'=>'No company address found'
            ],404);
        }

        return response()->json([
            'message'=>'Company address retrieved successfully',
            'data'=>$company
        ],200);
    }

    public function getContactBanner(){
        $company=Company::select('contact_banner_img')->first();
        if(!$company){
            return response()->json([
                'message'=>'No company contact banner found'
            ],404);
        }

        return response()->json([
            'message'=>'Company contact banner retrieved successfully',
            'data'=>$company
        ],200);
    }

    public function getServicesBanner(){
        $company=Company::select('services_banner_img')->first();
        if(!$company){
            return response()->json([
                'message'=>'No company services banner found'
            ],404);
        }

        return response()->json([
            'message'=>'Company services banner retrieved successfully',
            'data'=>$company
        ],200);
    }
}
