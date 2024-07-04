"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { useState } from "react";
import { activate, serverRedirect } from "../actions";

export default function ActivateForm() {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    const data = await activate(formData);
    if (data?.errors) return setError(data.errors);
    // setUser({ username: data.username });
    // setItem("auth", "true");
    await serverRedirect(`/users/${data.username}`);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormInput
        error={error}
        name="token"
        // type="password"
      />
      <ServerFormButton />
    </form>
  );
}
