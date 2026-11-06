import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../services/serviceApi";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });
}

function useServicesMutation<TData>(mutationFn: (data: TData) => Promise<unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      // A deleted service also removes its details.
      queryClient.invalidateQueries({ queryKey: ["service-details"] });
    },
  });
}

export function useCreateService() {
  return useServicesMutation(createService);
}

export function useUpdateService() {
  return useServicesMutation(updateService);
}

export function useDeleteService() {
  return useServicesMutation(deleteService);
}
