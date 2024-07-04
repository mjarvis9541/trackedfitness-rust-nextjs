import dietFormatter from "@/lib/diet-formatter";
import titleCase from "@/lib/title-case";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function DietMealItem({
  diet,
  handleChecker,
  mainChecked,
}: {
  diet: Diet;
  handleChecker: ChangeEventHandler<HTMLInputElement>;
  mainChecked: string[];
}) {
  const dietF = dietFormatter({ diet, places: 1, placesSalt: 2 });

  return (
    <div className="group contents">
      <div className="flex items-center justify-center group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={diet.id}
          checked={mainChecked.includes(diet.id)}
          onChange={handleChecker}
        />
      </div>
      <Link
        href={`/users/${diet.username}/diet/${diet.date}/${diet.meal_slug}/${diet.id}`}
        className="col-span-3 p-2 group-hover:bg-amber-200"
      >
        {diet.food_name}, {titleCase(diet.brand_name)}
      </Link>
      <Link
        href={`/users/${diet.username}/diet/${diet.date}/${diet.meal_slug}/${diet.id}/edit`}
        className="p-2 text-end group-hover:bg-amber-200"
      >
        {diet.data_measurement !== "srv"
          ? Number(diet.data_value).toFixed(0)
          : Number(diet.data_value).toFixed(1)}
        {diet.data_measurement}
      </Link>

      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietF.energy}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietF.protein}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietF.carbohydrate}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">{dietF.fat}g</div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietF.saturates}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietF.sugars}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietF.fibre}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">{dietF.salt}g</div>
    </div>
  );
}
