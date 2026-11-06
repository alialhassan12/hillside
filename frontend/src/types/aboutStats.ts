export interface AboutStat {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AboutStatsResponse {
  message: string;
  data: AboutStat[];
}
