type DietTotal = {
  id: string;
  date: string;
  total_day_energy: string;
  total_day_fat: string;
  total_day_saturates: string;
  total_day_carbohydrate: string;
  total_day_sugars: string;
  total_day_fibre: string;
  total_day_protein: string;
  total_day_salt: string;
  total_day_energy_per_kg: string;
  total_day_protein_per_kg: string;
  total_day_carbohydrate_per_kg: string;
  total_day_fat_per_kg: string;
  total_day_protein_pct: string;
  total_day_carbohydrate_pct: string;
  total_day_fat_pct: string;
  total_week_energy: string;
  total_week_protein: string;
  total_week_fat: string;
  total_week_carbohydrate: string;
  total_week_saturates: string;
  total_week_sugars: string;
  total_week_fibre: string;
  total_week_salt: string;
  avg_week_energy: string;
  avg_week_protein: string;
  avg_week_fat: string;
  avg_week_carbohydrate: string;
  avg_week_saturates: string;
  avg_week_sugars: string;
  avg_week_fibre: string;
  avg_week_salt: string;
  total_week_energy_per_kg: string;
  total_week_protein_per_kg: string;
  total_week_carbohydrate_per_kg: string;
  total_week_fat_per_kg: string;
  total_week_protein_pct: string;
  total_week_carbohydrate_pct: string;
  total_week_fat_pct: string;
};

type DeleteDateRangeInput = {
  date_range: string[];
  username: string;
};

type DietDayTotal = {
  date: string;
  username: string;
  // macros
  energy: number;
  protein: string;
  carbohydrate: string;
  fat: string;
  saturates: string;
  sugars: string;
  fibre: string;
  salt: string;
  // pct
  protein_pct: string;
  carbohydrate_pct: string;
  fat_pct: string;
  // pkg
  energy_per_kg: number;
  protein_per_kg: string;
  carbohydrate_per_kg: string;
  fat_per_kg: string;
  // weight
  latest_weight: number;
  latest_weight_date: number;
};

type DietTotalWeekAvgT = {
  week: number;
  week_avg_energy: number;
  week_avg_protein: string;
  week_avg_carbohydrate: string;
  week_avg_fat: string;
  week_avg_saturates: string;
  week_avg_sugars: string;
  week_avg_fibre: string;
  week_avg_salt: string;
  week_avg_protein_pct: string;
  week_avg_carbohydrate_pct: string;
  week_avg_fat_pct: string;
  week_avg_energy_per_kg: number;
  week_avg_protein_per_kg: string;
  week_avg_carbohydrate_per_kg: string;
  week_avg_fat_per_kg: string;
  week_avg_weight: string;
};
