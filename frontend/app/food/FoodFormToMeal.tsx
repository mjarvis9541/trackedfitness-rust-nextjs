"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import ServerFormSelect from "@/components/ServerFormSelect";
import { useState } from "react";
import { createMealItemFromFood } from "../actions";

export default function FoodFormToMeal({
  food,
  mealSelect,
}: {
  food: Food;
  mealSelect: MealSelect[];
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
    const meal_id = formData.get("meal_id");
    const quantity = formData.get("quantity");

    const data = await createMealItemFromFood({
      meal_id,
      food_id: food.id,
      data_measurement: food.data_measurement,
      quantity,
    });
    if (data?.errors) return setError(data.errors);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormSelect
        label="Meal"
        name="meal_id"
        options={mealSelect.map((meal) => ({
          label: meal.name_with_count,
          value: meal.id,
        }))}
        error={error}
      />
      <ServerFormInput
        name="quantity"
        label={`Quantity (${food.data_measurement})`}
        step={food.data_measurement === "srv" ? 0.1 : 1}
        type="number"
        defaultValue={n.toString()}
        error={error}
      />
      <ServerFormButton label="Add to Meal" />
    </form>
  );
}
