import { api } from "../lib/api";
import type {
  GalleryImage,
  GalleryImagesResponse,
  TourVideo,
  TourVideoResponse,
} from "../types/gallery";

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const response = await api.get<GalleryImagesResponse>("/gallery/images");

  // Laravel returns rows in no fixed order; keep the grid stable.
  return [...response.data.data].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
}

export async function uploadGalleryImage(file: File) {
  const formData = new FormData();

  formData.append("path", file);

  const response = await api.post("/gallery/images", formData);

  return response.data;
}

export async function deleteGalleryImage(id: string) {
  const response = await api.delete(
    `/gallery/images/delete/${encodeURIComponent(id)}`,
  );

  return response.data;
}

export async function getTourVideo(): Promise<TourVideo> {
  const response = await api.get<TourVideoResponse>("/gallery/video");

  return response.data.data;
}

export async function updateTourVideo(data: { id: string; video: File }) {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("video_path", data.video);

  // Videos are large, so turn off the default 15 second timeout.
  const response = await api.put("/gallery/video/update", formData, {
    timeout: 0,
  });

  return response.data;
}

export async function updateTourVideoThumbnail(data: {
  id: string;
  thumbnail: File;
}) {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("thumbnail_path", data.thumbnail);

  const response = await api.put("/gallery/video/thumbnail/update", formData);

  return response.data;
}
