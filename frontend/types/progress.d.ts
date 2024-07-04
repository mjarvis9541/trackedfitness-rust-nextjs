type Progress = {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  week_avg_weight: string;
  month_avg_weight: string;
  energy_burnt: number;
  week_avg_energy: string;
  month_avg_energy: string;
  notes: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_by_id: string;
  updated_by_id: string;
};

type ProgressListResponse = {
  count: number;
  next: string;
  previous: string;
  results: Progress[];
};

type ProgressInput = {
  id?: string;
  token?: string;
  username: string;
  date: string;
  weight_kg: string;
  notes: string;
  energy_burnt: number;
};

type ProgressDeleteDateRangeFormInput = {
  dateRange: string[];
  username: string;
  token: string;
};
