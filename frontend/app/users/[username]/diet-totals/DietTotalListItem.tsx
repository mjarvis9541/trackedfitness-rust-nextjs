import dietFormatter from "@/lib/diet-formatter";
import { formatDay, formatShortDate } from "@/lib/format-date";
import { formatISO } from "date-fns";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function DietTotalListItem({
  username,
  dietTotal,
  isChecked,
  handleCheck,
}: {
  username: string;
  dietTotal: DietDayTotal;
  isChecked: string[];
  handleCheck: ChangeEventHandler<HTMLInputElement>;
}) {
  const now = formatISO(new Date(), { representation: "date" });
  let diet = dietFormatter({
    diet: dietTotal,
    places: 0,
    placesPkg: 2,
    placesPct: 0,
  });
  return (
    <div className="group contents">
      <div
        className={
          dietTotal.date === now
            ? `bg-gray-100 p-2 group-hover:bg-amber-200`
            : `p-2  group-hover:bg-amber-200`
        }
      >
        <input
          type="checkbox"
          value={dietTotal.date}
          checked={isChecked.includes(dietTotal.date)}
          onChange={handleCheck}
        />
      </div>

      <Link
        href={`/users/${username}/diet/${dietTotal.date}`}
        className={
          dietTotal.date === now
            ? `bg-gray-100 p-2 text-right text-blue-500 group-hover:bg-amber-200`
            : `p-2 text-right text-blue-500 group-hover:bg-amber-200`
        }
      >
        {formatShortDate(dietTotal.date)}
      </Link>
      <Link
        href={`/users/${username}/diet/${dietTotal.date}`}
        className={
          dietTotal.date === now
            ? `bg-gray-100 p-2 text-left group-hover:bg-amber-200`
            : `p-2 text-left group-hover:bg-amber-200`
        }
      >
        {formatDay(dietTotal.date)}
      </Link>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.energy}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.protein}g
        <span className="ml-1 text-xs text-gray-400">
          ({diet.protein_pct}%)
        </span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.carbohydrate}g
        <span className="ml-1 text-xs text-gray-400">
          ({diet.carbohydrate_pct}%)
        </span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.fat}g
        <span className="ml-1 text-xs text-gray-400">({diet.fat_pct}%)</span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.saturates}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.sugars}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">{diet.fibre}g</div>
      <div className="p-2 text-end group-hover:bg-amber-200">{diet.salt}g</div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.energy_per_kg}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.protein_per_kg}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.carbohydrate_per_kg}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {diet.fat_per_kg}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietTotal.latest_weight ? (
          <Link
            href={{
              pathname: `/users/${username}/progress/${dietTotal.date}/edit`,
            }}
            className="text-blue-500"
          >
            <>{diet.latest_weight}kg</>
          </Link>
        ) : (
          <>
            <Link
              href={{
                pathname: `/users/${username}/progress/create`,
                query: { date: dietTotal.date },
              }}
              className="text-sm text-blue-500"
            >
              Add
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
