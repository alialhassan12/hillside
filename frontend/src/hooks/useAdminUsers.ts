import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAdmin,
  deleteAdmin,
  editAdmin,
  getAdmins,
} from "../services/adminUserApi";

export function useAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });
}

function useAdminsMutation<TData>(
  mutationFn: (data: TData) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useAddAdmin() {
  return useAdminsMutation(addAdmin);
}

export function useEditAdmin() {
  return useAdminsMutation(editAdmin);
}

export function useDeleteAdmin() {
  return useAdminsMutation(deleteAdmin);
}
