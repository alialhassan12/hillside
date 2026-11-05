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
