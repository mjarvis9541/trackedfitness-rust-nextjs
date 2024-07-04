import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import FoodForm from "../FoodForm";
import { createFood } from "../actions";

async function getBrandListSelect(): Promise<BrandSelect[]> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/brands/form/select`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function FoodCreatePage() {
  const brandSelect = await getBrandListSelect();
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Create Food</h1>
            <FoodForm action={createFood} brandSelect={brandSelect} />
          </div>
        </div>
      </div>
    </main>
  );
}
