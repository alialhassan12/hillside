export interface About {
  id: string;
  title: string;
  text: string;
  icon: string;
  image: string;
  created_at: string;
  updated_at: string;
  icon_url: string;
  image_url: string;
}

export interface AboutResponse {
  message: string;
  data: About[];
}
