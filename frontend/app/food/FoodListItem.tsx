import titleCase from "@/lib/title-case";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function FoodListItem({
  food,
  handleCheck,
  isChecked,
}: {
  food: Food;
  handleCheck: ChangeEventHandler<HTMLInputElement>;
  isChecked: string[];
}) {
  return (
    <div className="group contents">
      <div className="p-2 group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={food.id}
          checked={isChecked?.includes(food.id)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/food/${food.slug}`}
        className="col-span-2 truncate p-2 group-hover:bg-amber-200"
      >
        {titleCase(food.name)}
      </Link>
      <Link
        href={`/brands/${food.brand_slug}`}
        className="truncate p-2 capitalize group-hover:bg-amber-200"
      >
        {food.brand_name}
      </Link>
      <Link
        href={`/food/${food.slug}/edit`}
        className="p-2 text-end group-hover:bg-amber-200"
      >
        {Number(food.data_value).toFixed(0)}
        {food.data_measurement}
      </Link>

      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(food.energy).toFixed(0)}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(food.protein).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(food.carbohydrate).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(food.fat).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(food.saturates).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(food.sugars).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(food.fibre).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(food.salt).toFixed(2)}g
      </div>

      <div className="p-2 text-end text-sm text-gray-400 group-hover:bg-amber-200">
        {Number(food.protein_pct).toFixed(0)}%
      </div>
      <div className="p-2 text-end text-sm text-gray-400 group-hover:bg-amber-200">
        {Number(food.carbohydrate_pct).toFixed(0)}%
      </div>
      <div className="p-2 text-end text-sm text-gray-400 group-hover:bg-amber-200">
        {Number(food.fat_pct).toFixed(0)}%
      </div>
    </div>
  );
}
