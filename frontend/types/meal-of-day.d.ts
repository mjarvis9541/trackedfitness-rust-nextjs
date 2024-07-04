type MealOfDay = {
  id: string;
  name: string;
  slug: string;
  ordering: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_by_id: string;
  updated_by_id: string;
};

type MealOfDayAPIResponse = {
  count: number;
  next: string;
  previous: string;
  results: MealOfDay[];
};

type MealOfDayInput = {
  name: string;
  ordering: number;
};
