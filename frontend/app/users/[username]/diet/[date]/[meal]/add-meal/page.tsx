import Filter from "@/components/Filter";
import Search from "@/components/Search";
import { API, mealSortOptions, perPageOptions } from "@/lib/constants";
import { cookies } from "next/headers";
import DietAddMealList from "../../../DietAddMealList";

async function getMealList(
  username: string,
  page: string,
  search: string,
  order: string,
  size: string
): Promise<Meal[]> {
  const token = cookies().get("token")?.value;
  let url = `${API}/meals/user/${username}`;
  let paramCount = 0;
  let searchParams = [`?`];
  if (page) {
    if (paramCount >= 1) searchParams.push(`&`);
    paramCount += 1;
    searchParams.push(`page=${page}`);
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

async function getMealOfDay(slug: string): Promise<MealOfDay> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meal-of-day/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function DietAddMealPage({
  params: { username, date, meal },
  searchParams: { page, search, order, size },
}: {
  params: { username: string; date: string; meal: string };
  searchParams: {
    page: string;
    search: string;
    order: string;
    size: string;
  };
}) {
  const mealListFetch = getMealList(username, page, search, order, size);
  const modFetch = getMealOfDay(meal);
  const [mealOfDay, mealList] = await Promise.all([modFetch, mealListFetch]);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="rounded border bg-white p-4">
            <div className="mb-4 flex justify-between">
              <div>
                <h1 className="mb-2 text-xl font-bold">Add Meal</h1>
                <div className="font-bold">Results:</div>
              </div>
              <div className="flex basis-1/2 items-end gap-4">
                <div className="basis-1/3">
                  <Search />
                </div>
                <div className="basis-1/3">
                  <Filter
                    label="Sort"
                    filterParam="order"
                    defaultDisplay="Name (A-z)"
                    defaultValue="name"
                    options={mealSortOptions}
                  />
                </div>
                <div className="basis-1/3">
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
            <DietAddMealList
              date={date}
              mealList={mealList}
              mealOfDay={mealOfDay}
              username={username}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
