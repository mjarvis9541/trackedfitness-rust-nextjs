"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import ServerFormSelect from "@/components/ServerFormSelect";
import { formatISO } from "date-fns";
import { useState } from "react";
import { createDietFromFood } from "../actions";

export default function FoodFormToDiet({
  food,
  mealOfDayList,
}: {
  food: Food;
  mealOfDayList: MealOfDayAPIResponse;
}) {
  let n = food.data_value;
  if (food.last_added_qty) {
    n = Number(food.last_added_qty);
    if (food.data_measurement !== "srv") {
      n = Math.round((n *= 100));
    }
  }

  const [error, setError] = useState([]);
  const handleSubmit = async (formData: FormData) => {
    const date = formData.get("date");
    const quantity = formData.get("quantity");
    const meal_of_day_id = formData.get("meal_of_day_id");

    const data = await createDietFromFood({
      date,
      meal_of_day_id,
      data_measurement: food.data_measurement,
      quantity,
      food_id: food.id,
    });
    if (data?.errors) return setError(data.errors);
  };
  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormInput
        error={error}
        name="date"
        type="date"
        defaultValue={formatISO(new Date(), { representation: "date" })}
      />
      <ServerFormSelect
        label="Meal of Day"
        name="meal_of_day_id"
        options={mealOfDayList.results.map((meal) => ({
          label: meal.name,
          value: meal.id,
        }))}
        error={error}
      />
      <ServerFormInput
        error={error}
        label={`Quantity (${food.data_measurement})`}
        name="quantity"
        type="number"
        step={food.data_measurement === "srv" ? 0.1 : 1}
        defaultValue={n.toString()}
      />
      <ServerFormButton label="Add to Diet" />
    </form>
  );
}
