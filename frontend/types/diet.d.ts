type BaseDiet = {
  date: string;
  // macros
  energy: string;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  fibre: string;
  protein: string;
  salt: string;
  // pct
  protein_pct: string;
  carbohydrate_pct: string;
  fat_pct: string;
  // pkg
  energy_per_kg: string;
  protein_per_kg: string;
  carbohydrate_per_kg: string;
  fat_per_kg: string;
  // weight
  latest_weight: string;
  latest_weight_date: string;
};

type Diet = {
  id: string;
  user_id: string;
  username: string;
  date: string;
  meal_of_day_id: string;
  meal_name: string;
  meal_slug: string;
  meal_ordering: string;
  food_name: string;
  food_slug: string;
  brand_name: string;
  brand_slug: string;
  quantity: string;
  data_value: number;
  data_measurement: string;
  energy: number;
  fat: number;
  saturates: number;
  carbohydrate: number;
  sugars: number;
  fibre: number;
  protein: number;
  salt: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_by_id: string;
  updated_by_id: string;
  // Meal
  meal_energy: number;
  meal_fat: number;
  meal_saturates: number;
  meal_carbohydrate: number;
  meal_sugars: number;
  meal_fibre: number;
  meal_protein: number;
  meal_salt: number;
  // Day
  day_energy: number;
  day_fat: number;
  day_saturates: number;
  day_carbohydrate: number;
  day_sugars: number;
  day_fibre: number;
  day_protein: number;
  day_salt: number;
  // pct
  day_protein_pct: string;
  day_carbohydrate_pct: string;
  day_fat_pct: string;
  // pkg
  day_energy_per_kg: string;
  day_protein_per_kg: string;
  day_carbohydrate_per_kg: string;
  day_fat_per_kg: string;
  // weight
  latest_weight: string;
  latest_weight_date: string;
};

type DietAddFoodInput = {
  username: string;
  food_id: string;
  meal_of_day_id: string;
  quantity: number;
  data_measurement: string;
  token: string;
};

type DietFormInput = {
  date: string;
  meal_of_day_id: string;
  quantity: any;
};
