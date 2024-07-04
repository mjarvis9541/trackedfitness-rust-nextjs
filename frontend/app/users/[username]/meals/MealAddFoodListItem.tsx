"use client";

import { mealAddFood } from "@/app/actions";
import ServerFormButton from "@/components/ServerFormButton";
import titleCase from "@/lib/title-case";
import Link from "next/link";
import { useMemo, useState } from "react";

function calculateQuantity(
  dataValue: number,
  dataMeasurement: string,
  lastAddedQty?: string
) {
  if (dataMeasurement !== "srv" && lastAddedQty) {
    let num = Number(lastAddedQty);
    return Math.round((num *= 100));
  }
  return dataValue;
}

export default function MealAddFoodListItem({
  food,
  mealId,
  username,
}: {
  food: Food;
  mealId: string;
  username: string;
}) {
  const [error, setError] = useState([]);

  const quantity = useMemo(() => {
    return calculateQuantity(
      food.data_value,
      food.data_measurement,
      food.last_added_qty
    );
  }, [food.data_value, food.data_measurement, food.last_added_qty]);

  const handleSubmit = async (formData: FormData) => {
    formData.append("username", username);
    formData.append("mealId", mealId);
    formData.append("foodId", food.id);
    formData.append("foodId", food.id);

    const data = await mealAddFood(formData);
    if (data?.errors) return setError(data.errors);
    setError([]);
  };

  return (
    <form className="group contents" action={handleSubmit}>
      <Link
        className="col-span-3 truncate border-b-[1px] px-2 py-1 group-hover:bg-amber-200"
        href={`/food/${food.slug}`}
      >
        {food.name} <br />{" "}
        <span className="text-sm text-gray-500">
          {titleCase(food.brand_name)}
        </span>
      </Link>

      <div className="relative col-span-4 border-b-[1px] py-2 group-hover:bg-amber-200 md:col-span-1">
        <input
          className="w-full rounded border p-2"
          type="number"
          name="quantity"
          step={food.data_measurement === "srv" ? 0.1 : 1}
          defaultValue={quantity}
        />
        <span className="absolute right-10 top-5 text-sm text-gray-400">
          {food.data_measurement}
        </span>
      </div>

      <div className="flex items-center justify-end border-b-[1px] p-2 group-hover:bg-amber-200">
        {Number(food.energy.toFixed(0))}kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 group-hover:bg-amber-200">
        {Number(food.protein).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 group-hover:bg-amber-200">
        {Number(food.carbohydrate).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 group-hover:bg-amber-200">
        {Number(food.fat).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 group-hover:bg-amber-200">
        {Number(food.saturates).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 group-hover:bg-amber-200">
        {Number(food.sugars).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 group-hover:bg-amber-200">
        {Number(food.fibre).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 group-hover:bg-amber-200">
        {Number(food.salt).toFixed(2)}g
      </div>
      <div className="col-span-4 flex items-center justify-end border-b-[1px] group-hover:bg-amber-200 md:col-span-1">
        <ServerFormButton label="Add" />
      </div>
    </form>
  );
}
