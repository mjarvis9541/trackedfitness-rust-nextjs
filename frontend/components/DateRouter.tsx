import { formatLongDate } from "@/lib/format-date";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import Link from "next/link";

export default function DateRouter({
  date,
  path,
  modifier,
}: {
  date: string;
  path: string;
  modifier: string;
}) {
  const createDateStr = (direction: string) => {
    if (direction === "prev") {
      if (modifier === "day") {
        return format(subDays(new Date(date), 1), "yyyy-MM-dd");
      }
      if (modifier === "week") {
        return format(subWeeks(new Date(date), 1), "yyyy-MM-dd");
      }
      if (modifier === "month") {
        return format(subMonths(new Date(date), 1), "yyyy-MM-dd");
      }
    }
    if (direction === "next") {
      if (modifier === "day") {
        return format(addDays(new Date(date), 1), "yyyy-MM-dd");
      }
      if (modifier === "week") {
        return format(addWeeks(new Date(date), 1), "yyyy-MM-dd");
      }
      if (modifier === "month") {
        return format(addMonths(new Date(date), 1), "yyyy-MM-dd");
      }
    } else {
      return "";
    }
  };

  return (
    <nav className="flex items-center justify-between bg-zinc-600 text-zinc-100">
      <h1 className="px-3 py-2 font-bold">{formatLongDate(date)}</h1>

      <div className="flex">
        <Link className="px-3 py-2 hover:bg-amber-300" href={path}>
          Now
        </Link>
        <Link
          className="px-3 py-2 hover:bg-amber-300"
          href={path + "/" + createDateStr("prev")}
        >
          Previous
        </Link>
        <Link
          className="px-3 py-2 hover:bg-amber-300"
          href={path + "/" + createDateStr("next")}
        >
          Next
        </Link>
      </div>
    </nav>
  );
}
