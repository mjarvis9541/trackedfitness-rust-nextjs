type Food = {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  data_value: number;
  data_measurement: string;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  fibre: string;
  protein: string;
  salt: string;
  created_at: string;
  updated_at?: string;
  created_by: string;
  updated_by?: string;
  created_by_id: string;
  updated_by_id?: string;
  protein_pct: string;
  carbohydrate_pct: string;
  fat_pct: string;
  last_added_qty: string;
  last_added_date: string;
};

type FoodListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Food[];
};

type FoodFormInput = {
  name: string;
  brand_id: string;
  serving: string;
  data_value: number;
  data_measurement: string;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  fibre: string;
  protein: string;
  salt: string;
};

type FoodToDietInput = {
  date: string;
  food_id: string;
  meal_of_day_id: string;
  quantity: number;
};

type FoodToMealInput = {
  food_id: string;
  meal_id: string;
  quantity: number;
};
