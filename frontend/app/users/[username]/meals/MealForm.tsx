"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { useState } from "react";

export default function MealForm({
  action,
  initial,
  username,
}: {
  action: any;
  initial?: Meal;
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
      <ServerFormInput name="name" error={error} defaultValue={initial?.name} />
      <ServerFormButton />
    </form>
  );
}
