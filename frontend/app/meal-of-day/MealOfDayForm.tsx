"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { MutableRefObject, useRef, useState } from "react";

export default function MealOfDayForm({
  initial,
  action,
}: {
  action: any;
  initial?: MealOfDay;
}) {
  const form = useRef() as MutableRefObject<HTMLFormElement>;
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    if (initial) formData.append("slug", initial.slug);

    const data = await action(formData);
    if (data.errors) return setError(data.errors);
    setError([]);
    form.current.reset();
  };
  return (
    <form action={handleSubmit} ref={form}>
      <ServerError error={error} field="detail" />
      <ServerFormInput name="name" defaultValue={initial?.name} error={error} />
      <ServerFormInput
        name="ordering"
        type="number"
        defaultValue={initial?.ordering}
        error={error}
      />
      <ServerFormButton />
    </form>
  );
}
