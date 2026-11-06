import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteGalleryImage,
  getGalleryImages,
  getTourVideo,
  updateTourVideo,
  updateTourVideoThumbnail,
  uploadGalleryImage,
} from "../services/galleryApi";

export function useGalleryImages() {
  return useQuery({
    queryKey: ["gallery-images"],
    queryFn: getGalleryImages,
  });
}

export function useUploadGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
  });
}

export function useTourVideo() {
  return useQuery({
    queryKey: ["tour-video"],
    queryFn: getTourVideo,
  });
}

export function useUpdateTourVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTourVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour-video"] });
    },
  });
}

export function useUpdateTourVideoThumbnail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTourVideoThumbnail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour-video"] });
    },
  });
}
