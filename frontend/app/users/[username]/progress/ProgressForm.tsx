"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { formatISO } from "date-fns";
import { useState } from "react";

export default function ProgressForm({
  action,
  date = formatISO(new Date(), { representation: "date" }),
  initial,
  username,
}: {
  action: any;
  date?: string;
  initial?: Progress;
  username: string;
}) {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    formData.append("username", username);
    if (initial) formData.append("id", initial.id);

    const data = await action(formData);
    if (data?.errors) return setError(data.errors);
    setError([]);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormInput
        name="date"
        type="date"
        error={error}
        defaultValue={initial?.date || date}
      />
      <ServerFormInput
        name="weight_kg"
        type="number"
        label="Weight (kg)"
        error={error}
        defaultValue={initial?.weight_kg}
      />
      <ServerFormInput
        name="energy_burnt"
        type="number"
        label="Energy Burnt (kcal)"
        error={error}
        defaultValue={initial?.energy_burnt}
      />
      <ServerFormInput
        name="notes"
        error={error}
        defaultValue={initial?.notes}
      />
      <ServerFormButton />
    </form>
  );
}
