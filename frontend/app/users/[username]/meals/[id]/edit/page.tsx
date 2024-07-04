import { updateMeal } from "@/app/actions";
import AdminDetail from "@/components/AdminDetail";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import MealForm from "../../MealForm";

async function getMeal(id: string): Promise<Meal> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function MealUpdatePage({
  params: { id, username },
}: {
  params: { id: string; username: string };
}) {
  const meal = await getMeal(id);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Edit Meal</h1>
            <MealForm action={updateMeal} username={username} initial={meal} />
          </div>
        </div>
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Admin</h2>
            <AdminDetail data={meal} />
          </div>
        </div>
      </div>
    </main>
  );
}
