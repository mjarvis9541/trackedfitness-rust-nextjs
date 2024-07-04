import DeleteForm from "@/components/DeleteForm";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";

async function getDiet(id: string) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function DietDeletePage({
  params: { username, date, id },
}: {
  params: { username: string; date: string; id: string };
}) {
  const diet = await getDiet(id);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Delete Diet Log</h1>

            <p className="mb-3">
              Are you sure you wish to delete this diet log?
            </p>
            <p className="my-6 font-bold">
              {diet.food_name}, {diet.brand_name}, {diet.data_value}
              {diet.data_measurement}
            </p>
            <p className="mb-6">This action cannot be undone.</p>

            <DeleteForm
              url={`diet/${diet.id}`}
              revalidate={`/users/diet/[username]`}
              redirect={`/users/${username}/diet/${date}`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
