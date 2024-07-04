import { createMeal } from "@/app/actions";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import MealForm from "./MealForm";
import MealList from "./MealList";

async function getMealList(username: string): Promise<Meal[]> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meals/user/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function UserMealListPage({
  params: { username },
  searchParams: { page, search, order, size },
}: {
  params: { username: string };
  searchParams: {
    page: string;
    search: string;
    order: string;
    size: string;
  };
}) {
  const mealList = await getMealList(username);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Saved Meals</h1>
            <MealList mealList={mealList} username={username} />
          </div>
        </div>
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Create Meal</h1>
            <MealForm username={username} action={createMeal} />
          </div>
        </div>
      </div>
    </main>
  );
}
