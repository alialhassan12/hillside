// Laravel enum on testimonials.status.
export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Testimonial {
  id: string;
  name: string;
  representation: string | null;
  feedback: string;
  profile: string | null;
  profile_url: string;
  status: TestimonialStatus;
  is_shown: boolean;
  created_at: string;
  updated_at: string;
}

// Laravel's paginate() payload, nested inside "data".
export interface TestimonialsPage {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Testimonial[];
}

export interface TestimonialsResponse {
  message: string;
  data: TestimonialsPage;
}
