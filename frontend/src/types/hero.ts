export interface Hero {
  id: string;
  title: string;
  subTitle: string;
  image: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface HeroResponse {
  message: string;
  data: Hero;
}
