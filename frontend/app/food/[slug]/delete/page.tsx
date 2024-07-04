import DeleteForm from "@/components/DeleteForm";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";

async function getFoodDetail(slug: string): Promise<Food> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/food/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function FoodDeletePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const food = await getFoodDetail(slug);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Delete Food</h1>

            <p className="mb-3">Are you sure you wish to delete this food?</p>
            <p className="my-6 font-bold">
              {food.name}, {food.brand_name}, {food.data_value}
              {food.data_measurement}
            </p>
            <p className="mb-6">This action cannot be undone.</p>

            <DeleteForm
              url={`food/${food.slug}`}
              redirect={`/food`}
              revalidate={`/food/[slug]`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
