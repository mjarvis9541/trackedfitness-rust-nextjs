import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import FoodForm from "../../FoodForm";
import { updateFood } from "../../actions";

async function getFood(slug: string): Promise<Food> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/food/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getBrandSelect(): Promise<BrandSelect[]> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/brands/form/select`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function FoodUpdatePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const foodFn = getFood(slug);
  const brandSelectFn = getBrandSelect();
  const [food, brandSelect] = await Promise.all([foodFn, brandSelectFn]);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold capitalize">Edit Food</h1>
            <FoodForm
              action={updateFood}
              initial={food}
              brandSelect={brandSelect}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
