import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, foodSortOptions, perPageOptions } from "@/lib/constants";
import { cookies } from "next/headers";
import { Suspense } from "react";
import DietAddFoodList from "../../../DietAddFoodList";
import FilterWrapper from "./FilterWrapper";

async function getBrandListSelect(): Promise<BrandSelect[]> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/brands/form/select`, {
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
  if (search) {
    if (paramCount >= 1) searchParams.push(`&`);
    paramCount += 1;
    searchParams.push(`search=${search}`);
  }
  if (brand) {
    if (paramCount >= 1) searchParams.push(`&`);
    paramCount += 1;
    searchParams.push(`brand=${brand}`);
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

export default async function DietAddFoodPage({
  params: { username, date, meal },
  searchParams: { page, search, brand, order = "-last_added_date", size },
}: {
  params: { username: string; date: string; meal: string };
  searchParams: {
    page: string;
    search: string;
    brand: string;
    order: string;
    size: string;
  };
}) {
  const foodListData = getFoodList(page, search, brand, order, size);
  const modFetch = getMealOfDay(meal);
  const getBrand = getBrandListSelect();

  const [foodList, modDetail] = await Promise.all([foodListData, modFetch]);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="border bg-white p-4">
            <div className="mb-4 flex justify-between">
              <div>
                <h1 className="mb-2 text-xl font-bold">Add Food</h1>
                <div className="font-bold">Results: {foodList.count}</div>
              </div>
              <div className="flex basis-1/2 items-end gap-4">
                <Search />
                <Filter
                  label="Sort"
                  filterParam="order"
                  defaultDisplay="Name (A-z)"
                  defaultValue="name"
                  options={foodSortOptions}
                />
                <Suspense
                  fallback={
                    <Filter
                      label="Brand"
                      filterParam="brand"
                      options={[{ value: "", label: "loading" }]}
                    />
                  }
                >
                  <FilterWrapper promise={getBrand} />
                </Suspense>
                <Filter
                  label="Per Page"
                  defaultDisplay="25"
                  defaultValue="25"
                  filterParam="size"
                  options={perPageOptions}
                />
              </div>
            </div>
            <DietAddFoodList
              foodList={foodList}
              username={username}
              date={date}
              meal={modDetail}
            />
            <Pagination data={foodList} />
          </div>
        </div>
      </div>
    </main>
  );
}
