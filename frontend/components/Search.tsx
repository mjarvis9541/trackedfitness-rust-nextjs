"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";

export default function Search({
  autoFocus,
  label,
}: {
  autoFocus?: boolean;
  label?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const search = searchParams.get("search");
  const [value, setValue] = useState<string>(search || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      // @ts-ignore
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    router.push(
      pathname + "?" + createQueryString("search", event.target.value)
    );
  };

  return (
    <label>
      <span className="mb-1 inline-block text-sm font-bold capitalize">
        {label ? label : "Search"}
      </span>
      <input
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        placeholder="Search..."
        onChange={handleChange}
        type="text"
        className="flex w-full rounded border px-3 py-1.5 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}
