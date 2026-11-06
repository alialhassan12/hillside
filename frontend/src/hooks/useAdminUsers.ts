import { useMutation } from "@tanstack/react-query";
import { addAdmin, editAdmin } from "../services/adminUserApi";

export function useAddAdmin() {
  return useMutation({ mutationFn: addAdmin });
}

export function useEditAdmin() {
  return useMutation({ mutationFn: editAdmin });
}
