"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function Pagination({ data }: { data: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "25";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      // @ts-ignore
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const item_count = data.results.length;
  let non_zero;
  if (Number(size) < 1) {
    non_zero = 1;
  } else {
    non_zero = Number(size);
  }
  const total_pages = Math.ceil(Number(data.count) / Number(non_zero));

  return (
    <div className="flex justify-end gap-6">
      <div className="flex items-center gap-6">
        <div className="">
          Showing {item_count} of {data.count}
        </div>
        <div className="">
          Page {page} of {total_pages}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded border bg-gray-100 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-amber-200"
          disabled={Number(page) <= 1}
          onClick={() => {
            router.push(pathname + "?" + createQueryString("page", "1"));
          }}
        >
          First
        </button>
        <button
          className="rounded border bg-gray-100 px-4 text-sm text-gray-600 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-amber-200"
          disabled={Number(page) <= 1}
          onClick={() => {
            let next = Number(page) - 1;
            if (next <= 1) next = 1;
            router.push(
              pathname + "?" + createQueryString("page", next.toString())
            );
          }}
        >
          <FiArrowLeft size={20} />
        </button>
        <button
          className="rounded border bg-gray-100 px-4 text-sm text-gray-600 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-amber-200"
          disabled={Number(page) >= total_pages}
          onClick={() => {
            let next = Number(page) + 1;
            if (next >= total_pages) next = total_pages;
            router.push(
              pathname + "?" + createQueryString("page", next.toString())
            );
          }}
        >
          <FiArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
