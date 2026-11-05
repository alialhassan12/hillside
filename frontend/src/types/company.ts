export interface ServicesBanner {
  services_banner_img: string;
  services_banner_img_url: string;
  address_icon_url: string;
  contact_banner_img_url: string;
}

export interface ServicesBannerResponse {
  message: string;
  data: ServicesBanner;
}

export interface ContactBanner {
  contact_banner_img: string;
  address_icon_url: string;
  contact_banner_img_url: string;
  services_banner_img_url: string;
}

export interface ContactBannerResponse {
  message: string;
  data: ContactBanner;
}

export interface CompanyAddress {
  address: string;
  address_icon: string;
  address_icon_url: string;
  contact_banner_img_url: string;
  services_banner_img_url: string;
}

export interface CompanyAddressResponse {
  message: string;
  data: CompanyAddress;
}
