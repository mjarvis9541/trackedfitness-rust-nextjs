import AdminDetail from "@/components/AdminDetail";
import DeleteForm from "@/components/DeleteForm";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getMeal(id: string): Promise<Meal> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function MealDeletePage({
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
            <h1 className="mb-3 text-xl font-bold">Delete Meal</h1>

            <p className="mb-3">
              Are you sure you wish to delete this saved meal?
            </p>
            <p className="my-6 font-bold">{meal.name}</p>
            <p className="mb-6">This action cannot be undone.</p>

            <DeleteForm
              redirect={`/users/${username}/meals`}
              revalidate={`/users/[username]/meals/[id]`}
              url={`meals/${meal.id}`}
            />
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
