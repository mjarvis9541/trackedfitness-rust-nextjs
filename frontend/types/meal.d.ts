type MealSelect = {
  id: string;
  name_with_count: string;
};

type Meal = {
  id: string;
  user_id: string;
  name: string;
  energy: number;
  fat: number;
  saturates: number;
  carbohydrate: number;
  sugars: number;
  fibre: number;
  protein: number;
  salt: number;
  food_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_by_id: string;
  updated_by_id: string;
};

type MealFood = {
  id: string;
  user_id: string;
  meal_id: string;
  meal_name: string;
  food_id: string;
  food_name: string;
  food_slug: string;
  brand_name: string;
  brand_slug: string;
  quantity: string;
  data_value: string;
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
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_by_id: string;
  updated_by_id: string;
};

type MealInput = {
  name: string;
};

type MealFoodInput = {
  username: string;
  meal_id: string;
  meal_food_id: string;
  quantity: string | number;
};

type DeleteIdRangeInput = {
  id_range: string[];
  username: string;
};

type MealFoodListResponse = {
  id: string;
  user_id: string;
  meal_id: string;
  food_id: string;
  name: string;
  meal_name: string;
  food_name: string;
  food_slug: string;
  brand_name: string;
  brand_slug: string;
  quantity: number;
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
  meal_energy: number;
  meal_fat: string;
  meal_saturates: string;
  meal_carbohydrate: string;
  meal_sugars: string;
  meal_fibre: string;
  meal_protein: string;
  meal_salt: string;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  updated_by_id: string;
};

type AddFoodInput = {
  quantity: number;
};