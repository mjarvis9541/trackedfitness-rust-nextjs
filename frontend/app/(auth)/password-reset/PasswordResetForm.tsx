"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { useState } from "react";
import { passwordReset } from "../actions";

export default function PasswordResetForm() {
  const [error, setError] = useState([]);
  const handleSubmit = async (formData: FormData) => {
    const data = await passwordReset(formData);
    if (data?.errors) setError(data.errors);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormInput error={error} name="email" type="email" />
      <ServerFormButton label="Continue" />
    </form>
  );
}
