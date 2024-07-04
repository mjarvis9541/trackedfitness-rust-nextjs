import AdminDetail from "@/components/AdminDetail";
import { API } from "@/lib/constants";
import titleCase from "@/lib/title-case";
import { cookies } from "next/headers";
import Link from "next/link";
import FoodDetail from "../FoodDetail";
import FoodFormToDiet from "../FoodFormToDiet";
import FoodFormToMeal from "../FoodFormToMeal";

async function getFoodDetail(slug: string): Promise<Food> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/food/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getMealSelect() {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meals/form/select`, {
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

export default async function FoodDetailPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const mealOfDayListData = getMealOfDayList();
  const foodData = getFoodDetail(slug);
  const mealListFn = getMealSelect();
  const [food, mealOfDayList, mealSelect] = await Promise.all([
    foodData,
    mealOfDayListData,
    mealListFn,
  ]);
  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold capitalize">
              {food.name}, {food.data_value}
              {food.data_measurement}
            </h1>
            <p className="mb-3 font-bold">
              <Link href={`/brands/${food.brand_slug}`}>
                {titleCase(food.brand_name)}
              </Link>
            </p>

            <h3 className="mb-3 font-bold">Nutrition Information</h3>
            <FoodDetail food={food} />

            <p className="mb-2 mt-4">
              <Link
                href={`/food/${food.slug}/edit`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
            </p>
            <p>
              <Link
                href={`/food/${food.slug}/delete`}
                className="text-blue-500 hover:underline"
              >
                Delete
              </Link>
            </p>
          </div>
        </div>
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Add to Diet</h2>

            <FoodFormToDiet food={food} mealOfDayList={mealOfDayList} />
          </div>
        </div>
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Add to Meal</h2>

            <FoodFormToMeal food={food} mealSelect={mealSelect} />
          </div>
        </div>
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Admin</h2>
            <AdminDetail data={food} />
          </div>
        </div>
      </div>
    </main>
  );
}
