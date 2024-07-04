import { formatDay, formatShortDate } from "@/lib/format-date";
import Link from "next/link";

export default async function DietListItem({
  username,
  diet,
}: {
  username: string;
  diet: BaseDiet;
}) {
  return (
    <div className="group contents">
      <div className="grid place-content-center p-1.5 group-hover:bg-amber-200">
        <input type="checkbox" />
      </div>
      <div className="p-2 text-gray-900 group-hover:bg-amber-200">
        <Link
          href={`/users/${username}/diet/${diet.date}`}
          className="text-blue-500"
        >
          {formatShortDate(diet.date)}
        </Link>
      </div>
      <div className="p-2 text-gray-900 group-hover:bg-amber-200">
        <Link href={`/users/${username}/diet/${diet.date}`} className="">
          {formatDay(diet.date)}
        </Link>
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.energy).toFixed(0)}kcal
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.protein).toFixed(0)}g
        <span className="ml-1 text-end text-xs text-gray-400">
          ({Number(diet.protein_pct).toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.carbohydrate).toFixed(0)}g
        <span className="ml-1 text-end text-xs text-gray-400">
          ({Number(diet.carbohydrate_pct).toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.fat).toFixed(0)}g
        <span className="ml-1 text-end text-xs text-gray-400">
          ({Number(diet.fat_pct).toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.saturates).toFixed(0)}g
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.sugars).toFixed(0)}g
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.fibre).toFixed(0)}g
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.salt).toFixed(2)}g
      </div>

      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.energy_per_kg).toFixed(0)}kcal
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.protein_per_kg).toFixed(2)}g
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.carbohydrate_per_kg).toFixed(2)}g
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.fat_per_kg).toFixed(2)}g
      </div>
      <div className="p-2 text-end text-gray-900 group-hover:bg-amber-200">
        {Number(diet.latest_weight).toFixed(2)}kg
      </div>
    </div>
  );
}
