import { formatShortDateTime } from "@/lib/format-date";
import titleCase from "@/lib/title-case";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function MealOfDayListItem({
  mealOfDay,
  handleCheck,
  isChecked,
}: {
  mealOfDay: MealOfDay;
  handleCheck: ChangeEventHandler<HTMLInputElement>;
  isChecked: string[];
}) {
  return (
    <div className="group contents">
      <div className="p-2 group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={mealOfDay.id}
          checked={isChecked?.includes(mealOfDay.id)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/meal-of-day/${mealOfDay.slug}`}
        className="p-2 group-hover:bg-amber-200"
      >
        {titleCase(mealOfDay.name)}
      </Link>
      <div className="p-2 group-hover:bg-amber-200">{mealOfDay.slug}</div>
      <div className="p-2 group-hover:bg-amber-200">{mealOfDay.ordering}</div>
      <Link
        href={`/users/${mealOfDay.created_by}`}
        className="p-2 group-hover:bg-amber-200"
      >
        {mealOfDay.created_by}
      </Link>
      <div className="p-2 group-hover:bg-amber-200">
        {formatShortDateTime(mealOfDay.created_at)}
      </div>
      <div className="p-2 group-hover:bg-amber-200">
        {mealOfDay.updated_at ? formatShortDateTime(mealOfDay.updated_at) : "-"}
      </div>
    </div>
  );
}
