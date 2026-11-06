import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createServiceDetail,
  deleteServiceDetail,
  getServiceDetails,
  updateServiceDetail,
} from "../services/serviceApi";

export function useServiceDetails(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["service-details", serviceId],
    queryFn: () => getServiceDetails(serviceId!),
    enabled: Boolean(serviceId),
  });
}

function useServiceDetailsMutation<TData>(
  mutationFn: (data: TData) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-details"] });
    },
  });
}

export function useCreateServiceDetail() {
  return useServiceDetailsMutation(createServiceDetail);
}

export function useUpdateServiceDetail() {
  return useServiceDetailsMutation(updateServiceDetail);
}

export function useDeleteServiceDetail() {
  return useServiceDetailsMutation(deleteServiceDetail);
}
