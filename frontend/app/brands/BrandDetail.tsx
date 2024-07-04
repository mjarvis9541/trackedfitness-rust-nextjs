import { formatShortDateTime } from "@/lib/format-date";
import Link from "next/link";

export default function BrandDetail({ brand }: { brand: Brand }) {
  return (
    <table className="w-full border-collapse">
      <tbody>
        <tr>
          <th className="w-1/4 border p-2 text-left">Name</th>
          <td className="w-3/4 border p-2 text-left">{brand.name}</td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Slug</th>
          <td className="w-3/4 border p-2 text-left">{brand.slug}</td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Food</th>
          <td className="w-3/4 border p-2 text-left">
            <Link href={`/food/?brand=${brand.slug}`}>{brand.food_count}</Link>
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Created by</th>
          <td className="w-3/4 border p-2 text-left">{brand.created_by}</td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Updated by</th>
          <td className="w-3/4 border p-2 text-left">
            {brand.updated_by || "-"}
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Created at</th>
          <td className="w-3/4 border p-2 text-left">
            {formatShortDateTime(brand.created_at)}
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Updated at</th>
          <td className="w-3/4 border p-2 text-left">
            {brand.updated_at ? formatShortDateTime(brand.updated_at) : "-"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
