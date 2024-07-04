"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { useState } from "react";
import { signup } from "../actions";

export default function SignupForm() {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    const data = await signup(formData);
    if (data?.errors) setError(data.errors);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormInput error={error} name="name" />
      <ServerFormInput error={error} name="email" type="email" />
      <ServerFormInput error={error} name="username" />
      <ServerFormInput error={error} name="password" type="password" />
      <ServerFormButton label="Continue" />
    </form>
  );
}
