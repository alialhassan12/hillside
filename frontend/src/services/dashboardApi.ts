import { api } from "../lib/api";
import type { Testimonial } from "../types/testimonial";

// GET /api/dashboard (admin only). No "message"/"data" envelope.
export interface DashboardData {
  total_services: number;
  pending_feedbacks: number;
  unread_messages: number;
  gallery_count: number;
  // The 5 newest testimonials of any status.
  top_feedbacks: Testimonial[];
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<DashboardData>("/dashboard");

  return response.data;
}
