"use client";

import { actionDeleteIdRange } from "@/app/actions";
import ServerFormButton from "@/components/ServerFormButton";
import { useState } from "react";
import ServerError from "./ServerError";

export default function DeleteIdRangeFormFormN({
  url,
  username,
  revalidate,
  idRange,
  handleUncheckAll,
}: {
  handleUncheckAll: any;
  url: string;
  username: string;
  revalidate: string;
  idRange: string[];
}) {
  const [error, setError] = useState([]);

  const handleSubmit = async () => {
    const data = await actionDeleteIdRange(url, username, revalidate, idRange);
    if (data?.errors) return setError(data.errors);
    handleUncheckAll();
  };

  return (
    <>
      <form action={handleSubmit}>
        <ServerError error={error} field="detail" />
        <ServerFormButton
          label="Delete"
          style="delete"
          disabled={!idRange.length}
        />
      </form>
    </>
  );
}
