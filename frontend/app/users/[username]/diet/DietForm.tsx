"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import ServerFormSelect from "@/components/ServerFormSelect";
import { useState } from "react";

export default function DietForm({
  action,
  initial,
  modList,
}: {
  action: any;
  initial?: Diet;
  modList: MealOfDayAPIResponse;
}) {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    if (initial) {
      formData.append("diet_id", initial.id);
      formData.append("data_measurement", initial.data_measurement);
    }
    const data = await action(formData);
    if (data.errors) return setError(data.errors);
    setError([]);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormInput
        name="date"
        type="date"
        defaultValue={initial?.date}
        error={error}
      />
      <ServerFormSelect
        label="Meal of Day"
        name="meal_of_day_id"
        defaultValue={initial?.meal_of_day_id}
        options={modList.results.map((meal) => ({
          label: meal.name,
          value: meal.id,
        }))}
        error={error}
      />
      <ServerFormInput
        error={error}
        label={`Quantity (${initial?.data_measurement})`}
        name="quantity"
        type="number"
        step={initial?.data_measurement === "srv" ? 0.1 : 1}
        // @ts-ignore
        defaultValue={
          initial?.data_measurement === "srv"
            ? Number(initial?.data_value).toFixed(2)
            : initial?.data_value
        }
      />
      <ServerFormButton />
    </form>
  );
}
