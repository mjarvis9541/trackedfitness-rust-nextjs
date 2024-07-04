"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import { useState } from "react";
import { updateUser } from "../actions";

export default function UserForm({ user }: { user: User }) {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    if (user) formData.append("id", user.id);
    const data = await updateUser(formData);
    if (data?.errors) return setError(data.errors);
    setError([]);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormInput
        name="username"
        error={error}
        defaultValue={user?.name}
      />
      <ServerFormInput
        name="name"
        error={error}
        defaultValue={user?.username}
      />
      <ServerFormInput
        name="email"
        type="email"
        error={error}
        defaultValue={user?.email}
      />
      <ServerFormInput name="password" type="password" error={error} />
      <ServerFormButton />
    </form>
  );
}
