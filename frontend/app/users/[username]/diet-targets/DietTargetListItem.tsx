import dietFormatter from "@/lib/diet-formatter";
import { formatDay, formatShortDate } from "@/lib/format-date";
import { formatISO } from "date-fns";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function DietTargetListItem({
  username,
  dietTarget,
  isChecked,
  handleCheck,
}: {
  username: string;
  dietTarget: DietTarget;
  isChecked: string[];
  handleCheck: ChangeEventHandler<HTMLInputElement>;
}) {
  const now = formatISO(new Date(), { representation: "date" });
  const diet = dietFormatter({ diet: dietTarget });

  return (
    <div className="group contents">
      <div
        className={
          dietTarget.date === now
            ? `bg-gray-100 p-2 group-hover:bg-amber-200`
            : `p-2  group-hover:bg-amber-200`
        }
      >
        <input
          type="checkbox"
          value={dietTarget.date}
          checked={isChecked.includes(dietTarget.date)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={{
          pathname: dietTarget.id
            ? `/users/${username}/diet-targets/${dietTarget.date}`
            : `/users/${username}/diet-targets/create`,
          query: dietTarget.id ? {} : { date: dietTarget.date },
        }}
        className={
          dietTarget.date === now
            ? `bg-gray-100 p-2 text-right text-blue-500 group-hover:bg-amber-200`
            : `p-2 text-right text-blue-500 group-hover:bg-amber-200`
        }
      >
        {formatShortDate(dietTarget.date)}
      </Link>
      <Link
        href={{
          pathname: dietTarget.id
            ? `/users/${username}/diet-targets/${dietTarget.date}/edit`
            : `/users/${username}/diet-targets/create`,
          query: dietTarget.id ? {} : { date: dietTarget.date },
        }}
        className={
          dietTarget.date === now
            ? `bg-gray-100 p-2 text-left group-hover:bg-amber-200`
            : `p-2 text-left group-hover:bg-amber-200`
        }
      >
        {formatDay(dietTarget.date)}
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
        {dietTarget.weight ? <>{diet.weight}kg</> : "-"}
      </div>
    </div>
  );
}
