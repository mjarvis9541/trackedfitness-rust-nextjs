export const API = process.env.NEXT_PUBLIC_API;

export const servingOptions = [
  { id: "100g", name: "100g" },
  { id: "100ml", name: "100ml" },
  { id: "1srv", name: "1 Serving" },
];

export const sexOptions = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
];

export const activityLevelOptions = [
  { id: "SD", name: "Sedentary - Little to no exercise/desk job" },
  {
    id: "LA",
    name: "Lightly Active - Light exercise/sports 1-3 days a week",
  },
  {
    id: "MA",
    name: "Moderately Active - Moderate exercise/sports 3-5 days a week",
  },
  {
    id: "VA",
    name: "Very Active - Heavy exercise/sports 6-7 days a week",
  },
  {
    id: "EA",
    name: "Extremely Active - Very heavy exercise/physical job/training twice a day",
  },
];

export const genericSortOptions = [
  { id: "name", name: "Name (A-z)" },
  { id: "-name", name: "Name (Z-a)" },
  { id: "-created_by", name: "Created By (A-z)" },
  { id: "created_by", name: "Created By (Z-a)" },
  { id: "-created_at", name: "Created (Newest)" },
  { id: "created_at", name: "Created (Oldest)" },
  { id: "-updated_at", name: "Updated (Newest)" },
  { id: "updated_at", name: "Updated (Oldest)" },
];

export const mealOfDaySortOptions = [
  { id: "ordering", name: "Order (Asc)" },
  { id: "-ordering", name: "Order (Desc)" },
  { id: "name", name: "Name (A-z)" },
  { id: "-name", name: "Name (Z-a)" },
  { id: "-created_by", name: "Created By (A-z)" },
  { id: "created_by", name: "Created By (Z-a)" },
  { id: "-created_at", name: "Created (Newest)" },
  { id: "created_at", name: "Created (Oldest)" },
  { id: "-updated_at", name: "Updated (Newest)" },
  { id: "updated_at", name: "Updated (Oldest)" },
];

export const userSortOptions = [
  { id: "username", name: "Username (A-z)" },
  { id: "-username", name: "Username (Z-a)" },
  { id: "last_login", name: "Last Login (Latest)" },
  { id: "-last_login", name: "Last Login (Oldest)" },
];

export const perPageOptions = [
  // { id: "25", name: "25" },
  { id: "50", name: "50" },
  { id: "75", name: "75" },
  { id: "100", name: "100" },
];

export const goalOptions = [
  { id: "LW", name: "Lose Weight" },
  { id: "GW", name: "Build Muscle" },
  { id: "MW", name: "Maintain Weight" },
];

export const brandSortOptions = [
  // { id: "name", name: "Name (A-z)" },
  { id: "-name", name: "Name (Z-a)" },
  { id: "-created_by", name: "Created By (A-z)" },
  { id: "created_by", name: "Created By (Z-a)" },
  { id: "-created_at", name: "Created (Newest)" },
  { id: "created_at", name: "Created (Oldest)" },
  { id: "-updated_at", name: "Updated (Newest)" },
  { id: "updated_at", name: "Updated (Oldest)" },
  { id: "-food_count", name: "Food Count (High-Low)" },
  { id: "food_count", name: "Food Count (Low-High)" },
];

export const mealSortOptions = [
  // { id: "name", name: "Name (A-z)" },
  { id: "-name", name: "Name (Z-a)" },
  { id: "-created_by", name: "Created By (A-z)" },
  { id: "created_by", name: "Created By (Z-a)" },
  { id: "-created_at", name: "Created (Newest)" },
  { id: "created_at", name: "Created (Oldest)" },
  { id: "-updated_at", name: "Updated (Newest)" },
  { id: "updated_at", name: "Updated (Oldest)" },
  { id: "-food_count", name: "Food Count (High-Low)" },
  { id: "food_count", name: "Food Count (Low-High)" },
  { id: "-total_energy", name: "Calories (High-Low)" },
  { id: "total_energy", name: "Calories (Low-High)" },
  { id: "-total_protein", name: "Protein (High-Low)" },
  { id: "total_protein", name: "Protein (Low-High)" },
  { id: "-total_carbohydrate", name: "Carbs (High-Low)" },
  { id: "total_carbohydrate", name: "Carbs (Low-High)" },
  { id: "-total_fat", name: "Fat (High-Low)" },
  { id: "total_fat", name: "Fat (Low-High)" },
  { id: "-total_saturates", name: "Saturates (High-Low)" },
  { id: "total_saturates", name: "Saturates (Low-High)" },
  { id: "-total_sugars", name: "Sugars (High-Low)" },
  { id: "total_sugars", name: "Sugars (Low-High)" },
  { id: "-total_salt", name: "Salt (High-Low)" },
  { id: "total_salt", name: "Salt (Low-High)" },
];

export const foodSortOptions = [
  { id: "name", name: "Name (A-z)" },
  { id: "-name", name: "Name (Z-a)" },
  { id: "-last_added_date", name: "Last Added Date (Newest)" },
  { id: "last_added_date", name: "Last Added Date (Oldest)" },
  { id: "-created_at", name: "Created (Newest)" },
  { id: "created_at", name: "Created (Oldest)" },
  { id: "-updated_at", name: "Updated (Newest)" },
  { id: "updated_at", name: "Updated (Oldest)" },
  { id: "-energy", name: "Calories (High-Low)" },
  { id: "energy", name: "Calories (Low-High)" },
  { id: "-protein", name: "Protein (High-Low)" },
  { id: "protein", name: "Protein (Low-High)" },
  { id: "-carbohydrate", name: "Carbs (High-Low)" },
  { id: "carbohydrate", name: "Carbs (Low-High)" },
  { id: "-fat", name: "Fat (High-Low)" },
  { id: "fat", name: "Fat (Low-High)" },
  { id: "-saturates", name: "Saturates (High-Low)" },
  { id: "saturates", name: "Saturates (Low-High)" },
  { id: "-sugars", name: "Sugars (High-Low)" },
  { id: "sugars", name: "Sugars (Low-High)" },
  { id: "-fibre", name: "Fibre (High-Low)" },
  { id: "fibre", name: "Fibre (Low-High)" },
  { id: "-salt", name: "Salt (High-Low)" },
  { id: "salt", name: "Salt (Low-High)" },
];
