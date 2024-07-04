import Filter from "@/components/Filter";
import FilterN from "@/components/FilterN";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, perPageOptions, userSortOptions } from "@/lib/constants";
import { cookies } from "next/headers";
import UserList from "./UserList";

async function getUserList(
  page: string,
  search: string,
  order: string,
  size: string
): Promise<UserListResult> {
  const token = cookies().get("token")?.value;
  let url = `${API}/users`;
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
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function UserListPage({
  searchParams: { page, search, order, size },
}: {
  searchParams: {
    page: string;
    search: string;
    order: string;
    size: string;
  };
}) {
  const userList = await getUserList(page, search, order, size);

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-12">
          <div className="rounded border bg-white p-4">
            <div className="mb-4 flex justify-between">
              <div>
                <h1 className="mb-2 text-xl font-bold">Users</h1>
                <div className="font-bold">Results: {userList.count}</div>
              </div>

              <div className="flex basis-1/3 gap-4">
                <div className="basis-1/2">
                  <Search />
                </div>
                <div className="basis-1/2">
                  <FilterN
                    label="Sort"
                    filterParam="order"
                    options={userSortOptions}
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

            <UserList userList={userList} />
            <Pagination data={userList} />
          </div>
        </div>
      </div>
    </div>
  );
}
