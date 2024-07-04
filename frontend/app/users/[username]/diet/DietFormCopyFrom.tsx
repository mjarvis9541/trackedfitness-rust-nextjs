"use client";

import { dietCopyFrom } from "@/app/actions";
import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import { useState } from "react";

export default function DietFormCopyFrom({
  date,
  from_date,
  meal,
  username,
}: {
  from_date: string;
  date: string;
  meal: string;
  username: string;
}) {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    formData.append("from_date", from_date);
    formData.append("to_date", date);
    formData.append("from_meal", meal);
    formData.append("to_meal", meal);
    formData.append("from_username", username);
    formData.append("to_username", username);

    const data = await dietCopyFrom(formData);
    if (data?.errors) return setError(data.errors);
    setError([]);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormButton label="Copy" />
    </form>
  );
}
