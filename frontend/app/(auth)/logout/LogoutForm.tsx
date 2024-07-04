"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import { useState } from "react";
import { logout, serverRedirect } from "../actions";

export default function LogoutForm() {
  const [error, setError] = useState([]);

  const handleSubmit = async () => {
    await logout();
    await serverRedirect("/");
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormButton label="Log out" />
    </form>
  );
}
