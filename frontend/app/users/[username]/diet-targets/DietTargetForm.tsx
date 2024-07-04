"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { formatISO } from "date-fns";
import { useState } from "react";

export default function DietTargetForm({
  action,
  date = formatISO(new Date(), { representation: "date" }),
  dietTarget,
  username,
  latestWeight,
}: {
  action: any;
  date?: string;
  dietTarget?: DietTarget;
  username: string;
  latestWeight?: any;
}) {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    if (dietTarget) formData.append("id", dietTarget.id);
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
        name="date"
        type="date"
        defaultValue={dietTarget?.date || date}
      />
      <ServerFormInput
        error={error}
        name="weight"
        label="Weight (kg)"
        type="number"
        step={0.01}
        defaultValue={
          (dietTarget && Number(dietTarget.weight).toFixed(2)) ||
          (latestWeight && Number(latestWeight.weight_kg).toFixed(2))
        }
      />
      <ServerFormInput
        error={error}
        name="protein_per_kg"
        label="Protein (grams per kg)"
        type="number"
        step={0.01}
        defaultValue={
          dietTarget && Number(dietTarget.protein_per_kg).toFixed(2)
        }
      />
      <ServerFormInput
        error={error}
        name="carbohydrate_per_kg"
        label="Carbohydrate (grams per kg)"
        type="number"
        step={0.01}
        defaultValue={
          dietTarget && Number(dietTarget.carbohydrate_per_kg).toFixed(2)
        }
      />
      <ServerFormInput
        error={error}
        name="fat_per_kg"
        label="Fat (grams per kg)"
        type="number"
        step={0.01}
        defaultValue={dietTarget && Number(dietTarget.fat_per_kg).toFixed(2)}
      />
      <ServerFormButton />
    </form>
  );
}
