import AdminDetail from "@/components/AdminDetail";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import Link from "next/link";
import BrandDetail from "../BrandDetail";

async function getBrand(slug: string): Promise<Brand> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/brands/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function BrandDetailPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const brand = await getBrand(slug);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold capitalize">{brand.name}</h1>
            <BrandDetail brand={brand} />
            <p className="mb-2 mt-4">
              <Link
                href={`/brands/${brand.slug}/edit`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
            </p>
            <p>
              <Link
                href={`/brands/${brand.slug}/delete`}
                className="text-blue-500 hover:underline"
              >
                Delete
              </Link>
            </p>
          </div>
        </div>
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Admin</h2>
            <AdminDetail data={brand} />
          </div>
        </div>
      </div>
    </main>
  );
}
