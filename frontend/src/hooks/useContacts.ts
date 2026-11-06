import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../services/contactApi";

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });
}

function useContactsMutation<TData>(
  mutationFn: (data: TData) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useCreateContact() {
  return useContactsMutation(createContact);
}

export function useUpdateContact() {
  return useContactsMutation(updateContact);
}

export function useDeleteContact() {
  return useContactsMutation(deleteContact);
}
