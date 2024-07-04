import titleCase from "@/lib/title-case";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function MealFoodListItem({
  handleCheck,
  isChecked,
  mealFood,
  username,
}: {
  handleCheck: ChangeEventHandler<HTMLInputElement>;
  isChecked: string[];
  mealFood: MealFoodListResponse;
  username: string;
}) {
  return (
    <div className="group contents">
      <div className="border-b-[1px] p-2 group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={mealFood.id}
          checked={isChecked.includes(mealFood.id)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/users/${username}/meals/${mealFood.meal_id}/${mealFood.id}`}
        className="col-span-3 border-b-[1px] p-2 group-hover:bg-amber-200"
      >
        {mealFood.food_name}, {titleCase(mealFood.brand_name)}
      </Link>
      <Link
        href={`/users/${username}/meals/${mealFood.meal_id}/${mealFood.id}/edit`}
        className="border-b-[1px] p-2 text-end group-hover:bg-amber-200"
      >
        {mealFood.data_measurement !== "srv"
          ? Number(mealFood.data_value).toFixed(0)
          : Number(mealFood.data_value).toFixed(1)}
        {mealFood.data_measurement}
      </Link>

      <div className="border-b-[1px] p-2 text-end group-hover:bg-amber-200">
        {Number(mealFood.energy).toFixed(0)}kcal
      </div>
      <div className="border-b-[1px] p-2 text-end group-hover:bg-amber-200">
        {Number(mealFood.protein).toFixed(0)}g
      </div>
      <div className="border-b-[1px] p-2 text-end group-hover:bg-amber-200">
        {Number(mealFood.carbohydrate).toFixed(0)}g
      </div>
      <div className="border-b-[1px] p-2 text-end group-hover:bg-amber-200">
        {Number(mealFood.fat).toFixed(0)}g
      </div>
      <div className="border-b-[1px] p-2 text-end group-hover:bg-amber-200">
        {Number(mealFood.saturates).toFixed(0)}g
      </div>
      <div className="border-b-[1px] p-2 text-end group-hover:bg-amber-200">
        {Number(mealFood.sugars).toFixed(0)}g
      </div>
      <div className="border-b-[1px] p-2 text-end group-hover:bg-amber-200">
        {Number(mealFood.fibre).toFixed(0)}g
      </div>
      <div className="border-b-[1px] p-2 text-end group-hover:bg-amber-200">
        {Number(mealFood.salt).toFixed(1)}g
      </div>
    </div>
  );
}
