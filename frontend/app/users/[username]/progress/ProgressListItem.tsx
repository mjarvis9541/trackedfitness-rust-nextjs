import { formatDay, formatShortDate } from "@/lib/format-date";
import { formatISO } from "date-fns";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function ProgressListItem({
  username,
  progress,
  isChecked,
  handleCheck,
}: {
  username: string;
  progress: Progress;
  isChecked: string[];
  handleCheck: ChangeEventHandler<HTMLInputElement>;
}) {
  // console.log("progress list item");
  let formatProgress = {
    date: progress.date,
    energy: progress.energy_burnt ? (
      <>{Number(progress.energy_burnt).toFixed(0)}</>
    ) : null,
    week_avg_energy: progress?.week_avg_energy ? (
      <>{Number(progress.week_avg_energy).toFixed(0)}</>
    ) : null,
    month_avg_energy: progress?.month_avg_energy ? (
      <>{Number(progress.month_avg_energy).toFixed(0)}</>
    ) : null,
    weight: progress?.weight_kg ? (
      <>{Number(progress.weight_kg).toFixed(2)}</>
    ) : null,
    week_avg_weight: progress?.week_avg_weight ? (
      <>{Number(progress.week_avg_weight).toFixed(2)}</>
    ) : null,
    month_avg_weight: progress?.month_avg_weight ? (
      <>{Number(progress.month_avg_weight).toFixed(2)}</>
    ) : null,
    notes: progress.notes,
  };
  const now = formatISO(new Date(), { representation: "date" });

  return (
    <div className="group contents">
      <div
        className={
          progress.date === now
            ? `grid place-content-center border-b-[1px] border-r-[1px] bg-gray-100 p-2 group-hover:bg-amber-200`
            : `grid place-content-center border-b-[1px] border-r-[1px] p-2 group-hover:bg-amber-200`
        }
      >
        <input
          type="checkbox"
          disabled={!progress.id}
          checked={isChecked.includes(progress.date)}
          value={progress.date}
          onChange={handleCheck}
        />
      </div>
      <Link
        className={
          progress.date === now
            ? `border-b-[1px] border-r-[1px] bg-gray-100 p-2 text-blue-500 group-hover:bg-amber-200`
            : `border-b-[1px] border-r-[1px] p-2 text-blue-500 group-hover:bg-amber-200`
        }
        href={{
          pathname: progress.id
            ? `/users/${username}/progress/${progress.date}`
            : `/users/${username}/progress/create`,
          query: progress.id ? {} : { date: progress.date },
        }}
      >
        {formatShortDate(progress.date)}
      </Link>

      <Link
        href={{
          pathname: progress.id
            ? `/users/${username}/progress/${progress.date}/edit`
            : `/users/${username}/progress/create`,
          query: progress.id ? {} : { date: progress.date },
        }}
        className={
          progress.date === now
            ? `border-b-[1px] border-r-[1px] bg-gray-100 p-2 group-hover:bg-amber-200`
            : `border-b-[1px] border-r-[1px] p-2 group-hover:bg-amber-200`
        }
      >
        {formatDay(progress.date)}
      </Link>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end group-hover:bg-amber-200">
        {formatProgress.energy}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end group-hover:bg-amber-200">
        {formatProgress.week_avg_energy}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end group-hover:bg-amber-200">
        {formatProgress.month_avg_energy}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end group-hover:bg-amber-200">
        {formatProgress.weight}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end group-hover:bg-amber-200">
        {formatProgress.week_avg_weight}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end group-hover:bg-amber-200">
        {formatProgress.month_avg_weight}
      </div>

      <Link
        href={{
          pathname: progress.id
            ? `/users/${username}/progress/${progress.date}/edit`
            : `/users/${username}/progress/create`,
          query: progress.id ? {} : { date: progress.date },
        }}
        className="border-b-[1px] border-r-[1px] p-2 text-end group-hover:bg-amber-200"
      >
        {formatProgress.notes}
      </Link>
    </div>
  );
}
