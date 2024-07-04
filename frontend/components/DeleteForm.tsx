"use client";

import { actionDelete } from "@/app/actions";
import ServerFormButton from "@/components/ServerFormButton";
import { useState } from "react";
import ServerError from "./ServerError";

export default function DeleteForm({
  url,
  redirect,
  revalidate,
}: {
  url: string;
  redirect: string;
  revalidate: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    const data = await actionDelete(url, redirect, revalidate);
    if (data?.errors) {
      setLoading(false);
      return setError(data.errors);
    }
    setLoading(false);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormButton label="Delete" loading={loading} style="delete" />
    </form>
  );
}
