import FoodDetail from "@/app/food/FoodDetail";
import AdminDetail from "@/components/AdminDetail";
import { API } from "@/lib/constants";
import { formatShortDateStr } from "@/lib/format-date";
import { cookies } from "next/headers";
import Link from "next/link";

async function getDietDetail(id: string) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default async function DietDetailPage({
  params: { username, date, meal, id },
}: {
  params: { username: string; date: string; meal: string; id: string };
}) {
  const diet = await getDietDetail(id);

  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl font-bold">
        {diet?.date && formatShortDateStr(diet.date)}, {diet.meal_name}
      </h1>

      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">
              <Link href={`/food/${diet.food_slug}`}>{diet.food_name}</Link>,{" "}
              {Number(diet.data_value)}
              {diet.data_measurement}
            </h1>
            <p className="mb-3 font-bold capitalize">
              <Link href={`/brands/${diet.brand_slug}`}>{diet.brand_name}</Link>
            </p>

            <h3 className="mb-3 font-bold">Nutrition Information</h3>
            <FoodDetail food={diet} />

            <p className="mb-2 mt-4">
              <Link
                href={`/users/${diet.username}/diet/${diet.date}/${diet.meal_slug}/${diet.id}/edit`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
            </p>
            <p>
              <Link
                href={`/users/${diet.username}/diet/${diet.date}/${diet.meal_slug}/${diet.id}/delete`}
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
            <AdminDetail data={diet} />
          </div>
        </div>
      </div>
    </main>
  );
}
