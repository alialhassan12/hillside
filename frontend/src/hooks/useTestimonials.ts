import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  changeTestimonialStatus,
  changeTestimonialVisibility,
  deleteTestimonial,
  getAllTestimonials,
  getPublicTestimonials,
  sendFeedback,
  type TestimonialFilters,
} from "../services/testimonialApi";

// Admin list: every match for the filters (paged in the UI).
export function useTestimonials(filters: Omit<TestimonialFilters, "page">) {
  return useQuery({
    queryKey: ["testimonials", "all", filters],
    queryFn: () => getAllTestimonials(filters),
    // Keep the current list on screen while new filters load.
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

export function useDeleteTestimonial() {
  return useTestimonialsMutation(deleteTestimonial);
}
