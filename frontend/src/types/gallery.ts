export interface GalleryImage {
  id: string;
  path: string;
  path_url: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImagesResponse {
  message: string;
  data: GalleryImage[];
}

export interface TourVideo {
  id: string;
  video_path: string;
  thumbnail_path: string;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export interface TourVideoResponse {
  message: string;
  data: TourVideo;
}
