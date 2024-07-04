type DietTarget = {
  id: string;
  username: string;
  date: string;
  weight: string;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  protein: string;
  fibre: string;
  salt: string;
  protein_pct: number;
  carbohydrate_pct: number;
  fat_pct: number;
  energy_per_kg: string;
  protein_per_kg: string;
  carbohydrate_per_kg: string;
  fat_per_kg: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_by_id: string;
  updated_by_id: string;
};

type DietTargetInput = {
  id: string;
  username: string;
  weight: string;
  date: string;
  protein_per_kg: string;
  carbohydrate_per_kg: string;
  fat_per_kg: string;
  token: string;
};
