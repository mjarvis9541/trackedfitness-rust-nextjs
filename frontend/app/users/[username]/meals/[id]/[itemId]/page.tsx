import FoodDetail from "@/app/food/FoodDetail";
import AdminDetail from "@/components/AdminDetail";
import { API } from "@/lib/constants";
import titleCase from "@/lib/title-case";
import { cookies } from "next/headers";
import Link from "next/link";

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

export default async function MealFoodDetailPage({
  params: { username, id, itemId },
}: {
  params: { username: string; id: string; itemId: string };
}) {
  const mealFn = getMeal(id);
  const mealFoodFn = getMealFood(itemId);
  const [meal, mealFood] = await Promise.all([mealFn, mealFoodFn]);

  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl font-bold">{titleCase(meal.name)}</h1>

      <div className="mb-4 grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <p className="mb-3 text-xl font-bold">
              {mealFood.food_name}, {mealFood.data_value}
              {mealFood.data_measurement}
            </p>
            <p className="mb-3 font-bold">{titleCase(mealFood.brand_name)}</p>
            <h3 className="mb-3 font-bold">Nutrition Information</h3>

            <FoodDetail food={mealFood} />

            <p className="mb-2 mt-4">
              <Link
                href={`/users/${username}/meals/${meal.id}/${mealFood.id}/edit`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
            </p>
            <p>
              <Link
                href={`/users/${username}/meals/${meal.id}/${mealFood.id}/delete`}
                className="text-blue-500 hover:underline"
              >
                Delete
              </Link>
            </p>
          </div>
        </div>

        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Admin</h2>
            <AdminDetail data={mealFood} />
          </div>
        </div>
      </div>
    </main>
  );
}
