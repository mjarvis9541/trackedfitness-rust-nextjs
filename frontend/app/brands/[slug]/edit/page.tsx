import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import BrandForm from "../../BrandForm";
import { editBrand } from "../../actions";

async function getBrand(slug: string): Promise<Brand> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/brands/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function BrandUpdatePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const brand = await getBrand(slug);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold capitalize">
              Edit Brand {brand.name}
            </h1>
            <BrandForm action={editBrand} initial={brand} />
          </div>
        </div>
      </div>
    </main>
  );
}
