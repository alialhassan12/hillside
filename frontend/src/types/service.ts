export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  created_at: string;
  updated_at: string;
  icon_url: string;
}

export interface ServicesResponse {
  message: string;
  data: Service[];
}

export interface ServiceDetail {
  id: string;
  service_id: string;
  title: string;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string;
}

export interface ServiceDetailsResponse {
  message: string;
  data: ServiceDetail[];
}
