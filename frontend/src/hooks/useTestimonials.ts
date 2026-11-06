import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  changeTestimonialStatus,
  changeTestimonialVisibility,
  getPublicTestimonials,
  getTestimonials,
  sendFeedback,
  type TestimonialFilters,
} from "../services/testimonialApi";

export function useTestimonials(filters: TestimonialFilters) {
  return useQuery({
    queryKey: ["testimonials", filters],
    queryFn: () => getTestimonials(filters),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  });
}

// Public carousel: approved and visible feedback only.
export function usePublicTestimonials() {
  return useQuery({
    queryKey: ["testimonials", "public"],
    queryFn: getPublicTestimonials,
  });
}

function useTestimonialsMutation<TData>(
  mutationFn: (data: TData) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Refresh every testimonial list (all tabs and pages).
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

// Used by the public feedback form.
export function useSendFeedback() {
  return useTestimonialsMutation(sendFeedback);
}

export function useChangeTestimonialStatus() {
  return useTestimonialsMutation(changeTestimonialStatus);
}

export function useChangeTestimonialVisibility() {
  return useTestimonialsMutation(changeTestimonialVisibility);
}
