import { updateDiet } from "@/app/actions";
import { API } from "@/lib/constants";
import titleCase from "@/lib/title-case";
import { cookies } from "next/headers";
import Link from "next/link";
import DietForm from "../../../../DietForm";

async function getDiet(id: string) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getMealOfDayList(): Promise<MealOfDayAPIResponse> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meal-of-day`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function DietUpdatePage({
  params: { username, date, id },
}: {
  params: { username: string; date: string; id: string };
}) {
  const dietFetch = getDiet(id);
  const mealOfDayFetch = getMealOfDayList();
  const [diet, modList] = await Promise.all([dietFetch, mealOfDayFetch]);

  return (
    <main className="p-4">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold capitalize">
              <Link href={`/food/${diet.food_slug}`}>
                {diet.food_name}, {diet.data_value}
                {diet.data_measurement}
              </Link>
            </h1>

            <p className="mb-3 font-bold">
              <Link href={`/brands/${diet.brand_slug}`}>
                {titleCase(diet.brand_name)}
              </Link>
            </p>

            <DietForm action={updateDiet} initial={diet} modList={modList} />
          </div>
        </div>
      </div>
    </main>
  );
}
