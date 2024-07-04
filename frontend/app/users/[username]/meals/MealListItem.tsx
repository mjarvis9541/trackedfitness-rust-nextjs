import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function MealListItem({
  meal,
  username,
  isChecked,
  handleCheck,
}: {
  meal: Meal;
  username: string;
  isChecked: string[];
  handleCheck: ChangeEventHandler<HTMLInputElement>;
}) {
  let total = {
    energy: meal.energy ? Number(meal.energy).toFixed(1) : 0,
    protein: meal.protein ? Number(meal.protein).toFixed(1) : 0,
    carbohydrate: meal.carbohydrate ? Number(meal.carbohydrate).toFixed(1) : 0,
    fat: meal.fat ? Number(meal.fat).toFixed(1) : 0,
    saturates: meal.saturates ? Number(meal.saturates).toFixed(1) : 0,
    sugars: meal.sugars ? Number(meal.sugars).toFixed(1) : 0,
    fibre: meal.fibre ? Number(meal.fibre).toFixed(1) : 0,
    salt: meal.salt ? Number(meal.salt).toFixed(2) : "0.00",
  };
  return (
    <div className="group contents">
      <div className="p-2 text-end group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={meal.id}
          checked={isChecked?.includes(meal.id)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/users/${username}/meals/${meal.id}`}
        className="truncate p-2 group-hover:bg-amber-200"
      >
        {meal.name}
      </Link>
      <Link
        href={`/users/${username}/meals/${meal.id}`}
        className="p-2 text-end group-hover:bg-amber-200"
      >
        {meal.food_count}
      </Link>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {total.energy}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {total.protein}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {total.carbohydrate}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">{total.fat}g</div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {total.saturates}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {total.sugars}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {total.fibre}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">{total.salt}g</div>
    </div>
  );
}
