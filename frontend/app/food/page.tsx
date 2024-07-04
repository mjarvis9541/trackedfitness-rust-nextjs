import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, foodSortOptions, perPageOptions } from "@/lib/constants";
import { cookies } from "next/headers";
import FoodForm from "./FoodForm";
import FoodList from "./FoodList";
import { createFood } from "./actions";

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

export default async function FoodListPage({
  searchParams: { page, search, brand, order, size },
}: {
  searchParams: {
    page: string;
    search: string;
    brand: string;
    order: string;
    size: string;
  };
}) {
  const foodListFn = getFoodList(page, search, brand, order, size);
  const brandSelectFn = getBrandListSelect();

  const [foodList, brandSelect] = await Promise.all([
    foodListFn,
    brandSelectFn,
  ]);

  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-12">
          <div className="rounded border bg-white p-4">
            <div className="mb-4 flex justify-between">
              <div>
                <h1 className="mb-2 text-xl font-bold">Food</h1>
                <div className="font-bold">Results: {foodList.count}</div>
              </div>
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
            <FoodList foodList={foodList} />
            <Pagination data={foodList} />
          </div>
        </div>
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Create Food</h2>
            <FoodForm action={createFood} brandSelect={brandSelect} />
          </div>
        </div>
      </div>
    </main>
  );
}
