import Filter from "@/components/Filter";
import FilterN from "@/components/FilterN";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, mealOfDaySortOptions, perPageOptions } from "@/lib/constants";
import { cookies } from "next/headers";
import MealOfDayForm from "./MealOfDayForm";
import MealOfDayList from "./MealOfDayList";
import { mealOfDayCreate } from "./actions";

async function getMealOfDayList(
  page: string,
  search: string,
  order: string,
  size: string
): Promise<MealOfDayAPIResponse> {
  const token = cookies().get("token")?.value;
  let url = `${API}/meal-of-day`;
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

export default async function MealOfDayListPage({
  searchParams: { page, search, order, size },
}: {
  searchParams: {
    page: string;
    search: string;
    order: string;
    size: string;
  };
}) {
  const mealOfDayList = await getMealOfDayList(page, search, order, size);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="rounded border bg-white p-4">
            <div className="mb-4 flex justify-between">
              <div>
                <h1 className="mb-2 text-xl font-bold">Meal of Day</h1>
                <div className="font-bold">Results: {mealOfDayList.count}</div>
              </div>
              <div className="flex basis-1/3 gap-4">
                <div className="basis-1/2">
                  <Search />
                </div>
                <div className="basis-1/2">
                  <FilterN
                    label="Sort"
                    filterParam="order"
                    options={mealOfDaySortOptions}
                  />
                </div>
                <div className="basis-1/4">
                  <Filter
                    label="Per Page"
                    filterParam="size"
                    defaultDisplay="25"
                    defaultValue="25"
                    options={perPageOptions}
                  />
                </div>
              </div>
            </div>

            <MealOfDayList mealOfDayList={mealOfDayList} />
            <Pagination data={mealOfDayList} />
          </div>
        </div>
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Create Meal of Day</h2>

            <MealOfDayForm action={mealOfDayCreate} />
          </div>
        </div>
      </div>
    </main>
  );
}
