import { updateMealFood } from "@/app/actions";
import { API } from "@/lib/constants";
import titleCase from "@/lib/title-case";
import { cookies } from "next/headers";
import MealFoodForm from "../../../MealFoodForm";

async function getMeal(id: string): Promise<Meal> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getMealFood(id: string): Promise<MealFood> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meal-food/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function MealItemDetailPage({
  params: { username, id, itemId },
}: {
  params: { username: string; id: string; itemId: string };
}) {
  const mealFn = getMeal(id);
  const mealFoodFn = getMealFood(itemId);
  const [meal, mealFood] = await Promise.all([mealFn, mealFoodFn]);

  return (
    <main className="p-4">
      <div className="mb-4 grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <div className="mb-3">
              <h1 className="mb-1 text-xl font-bold">
                Edit {titleCase(meal.name)}
              </h1>
              <p className="font-bold">
                {mealFood.food_name}, {mealFood.data_value}
                {mealFood.data_measurement}
              </p>
              <p className="font-bold">{titleCase(mealFood.brand_name)}</p>
            </div>

            <MealFoodForm
              username={username}
              initial={mealFood}
              action={updateMealFood}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
