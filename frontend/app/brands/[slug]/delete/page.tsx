import DeleteForm from "@/components/DeleteForm";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";

async function getBrand(slug: string): Promise<Brand> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/brands/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function BrandDeletePage({
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
            <h1 className="mb-3 text-xl font-bold">Delete Brand</h1>

            <p className="mb-3">Are you sure you wish to delete this brand?</p>
            <p className="my-6 font-bold">{brand.name}</p>
            <p className="mb-6">This action cannot be undone.</p>

            <DeleteForm
              url={`brands/${brand.slug}`}
              redirect={`/brands`}
              revalidate={`/brands/[slug]`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
