import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  changeMessageStatus,
  deleteMessage,
  getMessages,
  sendMessage,
} from "../services/messageApi";

export function useMessages(page: number, search: string) {
  return useQuery({
    queryKey: ["messages", page, search],
    queryFn: () => getMessages(page, search),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  });
}

function useMessagesMutation<TData>(
  mutationFn: (data: TData) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useChangeMessageStatus() {
  return useMessagesMutation(changeMessageStatus);
}

export function useDeleteMessage() {
  return useMessagesMutation(deleteMessage);
}

// Used by the public Contact form.
export function useSendMessage() {
  return useMessagesMutation(sendMessage);
}
