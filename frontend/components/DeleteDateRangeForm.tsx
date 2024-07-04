"use client";

import { actionDeleteDateRange } from "@/app/actions";
import ServerError from "@/components/ServerError";
import { useState } from "react";
import ServerFormButton from "./ServerFormButton";

export default function DeleteDateRangeForm({
  dateRange,
  handleUncheckAll,
  revalidate,
  url,
  username,
}: {
  dateRange: string[];
  handleUncheckAll: any;
  revalidate: string;
  url: string;
  username: string;
}) {
  const [error, setError] = useState([]);

  const handleSubmit = async () => {
    const data = await actionDeleteDateRange(
      url,
      username,
      revalidate,
      dateRange
    );
    if (data?.errors) return setError(data.errors);
    handleUncheckAll();
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormButton
        label="Delete"
        style="delete"
        disabled={!dateRange.length}
      />
    </form>
  );
}
