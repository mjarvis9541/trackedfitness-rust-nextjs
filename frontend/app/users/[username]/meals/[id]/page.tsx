import AdminDetail from "@/components/AdminDetail";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, foodSortOptions, perPageOptions } from "@/lib/constants";
import titleCase from "@/lib/title-case";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import MealAddFoodList from "../MealAddFoodList";
import MealFoodList from "../MealFoodList";

async function getMeal(id: string): Promise<Meal> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getMealFoodList(id: string): Promise<MealFoodListResponse[]> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meals/${id}/food`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getBrandListSelect(): Promise<BrandSelect[]> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/brands/form/select`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getFoodList(
  page: string,
  search: string,
  brand: string,
  order: string,
  size: string
): Promise<FoodListResponse> {
  const token = cookies().get("token")?.value;
  let url = `${API}/food`;
  let paramCount = 0;
  let searchParams = [`?`];
  if (page) {
    if (paramCount >= 1) searchParams.push(`&`);
    paramCount += 1;
    searchParams.push(`page=${page}`);
  }
  if (brand) {
    if (paramCount >= 1) searchParams.push(`&`);
    paramCount += 1;
    searchParams.push(`brand=${brand}`);
  }
  if (search) {
    if (paramCount >= 1) searchParams.push(`&`);
    paramCount += 1;
    searchParams.push(`search=${search}`);
  }
  if (order) {
    if (paramCount >= 1) searchParams.push(`&`);
    paramCount += 1;
    searchParams.push(`order=${order}`);
  }
  if (size) {
    if (paramCount >= 1) searchParams.push(`&`);
    paramCount += 1;
    searchParams.push(`size=${size}`);
  }
  if (paramCount >= 1) {
    url += searchParams.join("");
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function MealDetailPage({
  params: { id, username },
  searchParams: { page, search, brand, order, size },
}: {
  params: { id: string; username: string };
  searchParams: {
    page: string;
    search: string;
    brand: string;
    order: string;
    size: string;
  };
}) {
  const mealFn = getMeal(id);
  const mealFoodFn = getMealFoodList(id);
  const foodListData = getFoodList(page, search, brand, order, size);
  const brandSelectData = getBrandListSelect();
  const [meal, mealFoodList, foodList, brandSelect] = await Promise.all([
    mealFn,
    mealFoodFn,
    foodListData,
    brandSelectData,
  ]);
  return (
    <main className="p-4">
      <div className="mb-4 grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="border bg-white p-4">
            <div className="flex justify-between">
              <h1 className="mb-3 text-xl font-bold">{titleCase(meal.name)}</h1>
              <div className="flex gap-4">
                <Link
                  href={`/users/${username}/meals/${meal.id}/edit`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/users/${username}/meals/${meal.id}/delete`}
                  className="text-blue-500 hover:underline"
                >
                  Delete
                </Link>
              </div>
            </div>

            <MealFoodList mealFoodList={mealFoodList} username={username} />
          </div>
        </div>

        <div className="col-span-full">
          <div className="border bg-white p-4">
            <div className="mb-1 flex justify-between">
              <h1 className="text-xl font-bold">Add Food ({foodList.count})</h1>
              <div className="flex basis-1/2 items-end gap-4">
                <div className="basis-1/3">
                  <Search />
                </div>
                <div className="basis-1/3">
                  <Filter
                    label="Brand"
                    filterParam="brand"
                    options={brandSelect?.map((brand) => ({
                      value: brand.slug,
                      label: brand.name_with_count,
                    }))}
                  />
                </div>
                <div className="basis-1/3">
                  <Filter
                    label="Sort"
                    filterParam="order"
                    defaultDisplay="Name (A-z)"
                    defaultValue="name"
                    options={foodSortOptions}
                  />
                </div>
                <div className="basis-1/6">
                  <Filter
                    label="Per Page"
                    defaultDisplay="25"
                    defaultValue="25"
                    filterParam="size"
                    options={perPageOptions}
                  />
                </div>
              </div>
            </div>
            <MealAddFoodList
              username={username}
              mealId={id}
              foodList={foodList}
            />
            <Pagination data={foodList} />
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
