import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, brandSortOptions, perPageOptions } from "@/lib/constants";
import { cookies } from "next/headers";
import BrandForm from "./BrandForm";
import BrandList from "./BrandList";
import { createBrand } from "./actions";

async function getBrandList(
  page: string,
  search: string,
  order: string,
  size: string
): Promise<BrandListResult> {
  const token = cookies().get("token")?.value;
  let url = `${API}/brands`;
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

export default async function BrandListPage({
  searchParams: { page, search, order, size },
}: {
  searchParams: {
    page: string;
    search: string;
    order: string;
    size: string;
  };
}) {
  const brandList = await getBrandList(page, search, order, size);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="rounded border bg-white p-4">
            <div className="mb-4 flex justify-between">
              <div>
                <h1 className="mb-2 text-xl font-bold">Brands</h1>
                <div className="font-bold">Results: {brandList.count}</div>
              </div>

              <div className="flex basis-1/3 gap-4">
                <div className="basis-1/2">
                  <Search />
                </div>
                <div className="basis-1/2">
                  <Filter
                    label="Sort"
                    filterParam="order"
                    defaultDisplay="Name (A-z)"
                    defaultValue="name"
                    options={brandSortOptions}
                  />
                </div>
                <div className="basis-1/4">
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
            <BrandList brandList={brandList} />
            <Pagination data={brandList} />
          </div>
        </div>
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Create Brand</h2>
            <BrandForm action={createBrand} />
          </div>
        </div>
      </div>
    </main>
  );
}
