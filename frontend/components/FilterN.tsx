"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";

export default function FilterN({
  filterParam,
  label,
  options,
}: {
  filterParam: string;
  label?: string;
  options: Array<{}>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const search = searchParams.get(filterParam);
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

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
    router.push(
      pathname + "?" + createQueryString(filterParam, event.target.value)
    );
  };

  return (
    <label>
      <span className="mb-1 inline-block text-sm font-bold">
        {label ? label : "Filter"}
      </span>
      <select
        value={value}
        onChange={handleChange}
        className="w-full rounded border bg-transparent px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 active:border-blue-500 active:ring-2 active:ring-blue-500"
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
