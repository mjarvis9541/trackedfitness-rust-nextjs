import { formatShortDateTime } from "@/lib/format-date";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function BrandListItem({
  brand,
  handleCheck,
  isChecked,
}: {
  brand: Brand;
  handleCheck: ChangeEventHandler<HTMLInputElement>;
  isChecked: string[];
}) {
  return (
    <div className="group contents">
      <div className="p-2 group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={brand.id}
          checked={isChecked?.includes(brand.id)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/brands/${brand.slug}`}
        className="p-2 group-hover:bg-amber-200"
      >
        {brand.name}
      </Link>
      <Link
        href={`/brands/${brand.slug}`}
        className="p-2 group-hover:bg-amber-200"
      >
        {brand.slug}
      </Link>
      <Link
        href={`/food/?brand=${brand.slug}`}
        className="p-2 group-hover:bg-amber-200"
      >
        {brand.food_count}
      </Link>
      <Link
        href={`/users/${brand.created_by}`}
        className="p-2 group-hover:bg-amber-200"
      >
        {brand.created_by}
      </Link>
      <div className="p-2 group-hover:bg-amber-200">
        {formatShortDateTime(brand.created_at)}
      </div>
      <div className="p-2 group-hover:bg-amber-200">
        {brand.updated_at ? formatShortDateTime(brand.updated_at) : "-"}
      </div>
    </div>
  );
}
