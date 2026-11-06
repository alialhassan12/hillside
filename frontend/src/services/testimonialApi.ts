import { api } from "../lib/api";
import { isNotFound } from "../lib/apiErrors";
import type {
  Testimonial,
  TestimonialStatus,
  TestimonialsPage,
  TestimonialsResponse,
} from "../types/testimonial";

export type SendFeedbackData = {
  name: string;
  representation?: string;
  feedback: string;
  profile?: File;
};

// POST /api/feedback/send — new feedback starts as "pending" and is only
// shown publicly after an admin approves it.
export async function sendFeedback(data: SendFeedbackData) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("feedback", data.feedback);

  if (data.representation) {
    formData.append("representation", data.representation);
  }

  if (data.profile) {
    formData.append("profile", data.profile);
  }

  const response = await api.post("/feedback/send", formData);

  return response.data;
}

export type TestimonialFilters = {
  status: TestimonialStatus;
  search: string;
  // Only sent when set: 1 = shown, 0 = hidden.
  visibility?: 0 | 1;
  page: number;
};

export async function getTestimonials(
  filters: TestimonialFilters,
): Promise<TestimonialsPage> {
  const { status, search, visibility, page } = filters;

  try {
    const response = await api.get<TestimonialsResponse>("/testimonials", {
      params: {
        status,
        page,
        ...(search ? { search } : {}),
        ...(visibility !== undefined ? { visibility } : {}),
      },
    });

    return response.data.data;
  } catch (error) {
    // Laravel answers 404 when nothing matches; treat it as an empty page.
    if (isNotFound(error)) {
      return { current_page: page, last_page: 1, per_page: 10, total: 0, data: [] };
    }
    throw error;
  }
}

// Safety cap: at most this many API pages (10 items each).
const MAX_API_PAGES = 20;

// All testimonials matching a status/search/visibility, newest first.
// The admin page shows them 6 at a time.
export async function getAllTestimonials(
  filters: Omit<TestimonialFilters, "page">,
): Promise<Testimonial[]> {
  const first = await getTestimonials({ ...filters, page: 1 });
  const lastPage = Math.min(first.last_page, MAX_API_PAGES);

  const rest = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) =>
      getTestimonials({ ...filters, page: index + 2 }),
    ),
  );

  return [first, ...rest]
    .flatMap((page) => page.data)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function changeTestimonialStatus(data: {
  id: string;
  status: TestimonialStatus;
}) {
  const response = await api.put("/testimonials/status/change", data);

  return response.data;
}

// The backend only allows this for approved testimonials.
export async function changeTestimonialVisibility(data: {
  id: string;
  is_shown: boolean;
}) {
  const response = await api.put("/testimonials/visibility/change", data);

  return response.data;
}

// Public website: GET /api/testimonials/public returns only approved and
// shown testimonials (not paginated), so visitors never see the rest.
export async function getPublicTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await api.get<{ message: string; data: Testimonial[] }>(
      "/testimonials/public",
    );

    return (
      response.data.data
        // Extra guard on top of the server filter.
        .filter((item) => item.status === "approved" && item.is_shown)
        // Oldest first, so the carousel order stays the same.
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
    );
  } catch (error) {
    if (isNotFound(error)) return [];
    throw error;
  }
}

// Only rejected testimonials can be deleted (backend rule).
export async function deleteTestimonial(id: string) {
  const response = await api.delete(
    `/testimonials/delete/${encodeURIComponent(id)}`,
  );

  return response.data;
}
