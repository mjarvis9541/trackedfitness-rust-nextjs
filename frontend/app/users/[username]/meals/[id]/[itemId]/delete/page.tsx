import DeleteForm from "@/components/DeleteForm";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";

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

export default async function MealFoodDeletePage({
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
            <h1 className="mb-3 text-xl font-bold">Delete Meal Item</h1>

            <p className="mb-3">
              Are you sure you wish to delete this meal item?
            </p>
            <p className="my-6 font-bold">
              {mealFood.food_name}, {mealFood.data_value}
              {mealFood.data_measurement}
            </p>
            <p className="mb-6">This action cannot be undone.</p>

            <DeleteForm
              url={`meal-food/${itemId}`}
              redirect={`/users/${username}/meals/${id}`}
              revalidate={`/users/[username]/meals/[id]`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
