type Profile = {
  id: string;
  user_id: string;
  username: string;
  sex: string;
  age: number;
  date_of_birth: string;
  height: number;
  weight: string;
  weight_updated_at: string;
  fitness_goal: string;
  activity_level: string;
  bmi: number;
  bmr: number;
  tdee: number;
  target_calories: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_by_id: string;
  updated_by_id: string;
};

type ProfileInput = {
  activity_level: string;
  date_of_birth: string;
  fitness_goal: string;
  height: number;
  sex: string;
  weight: string;
};
