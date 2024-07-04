"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { useState } from "react";

export default function MealFoodForm({
  action,
  initial,
  username,
}: {
  action: any;
  initial?: MealFood;
  username: string;
}) {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    if (initial) {
      formData.append("id", initial.id);
      formData.append("meal_id", initial.meal_id);
      formData.append("food_id", initial.food_id);
      formData.append("data_measurement", initial.data_measurement);
    }
    formData.append("username", username);
    const data = await action(formData);
    if (data?.errors) return setError(data.errors);
    setError([]);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormInput
        error={error}
        label={`Quantity (${initial?.data_measurement})`}
        name="quantity"
        type="number"
        step={initial?.data_measurement === "srv" ? 0.1 : 1}
        // @ts-ignore
        defaultValue={
          initial?.data_measurement === "srv"
            ? Number(initial?.data_value).toFixed(1)
            : initial?.data_value
        }
      />

      <ServerFormButton />
    </form>
  );
}
