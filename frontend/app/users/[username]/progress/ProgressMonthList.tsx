"use client";

import DeleteDateRangeForm from "@/components/DeleteDateRangeForm";
import createMonthRange from "@/lib/create-month-range";
import { ChangeEventHandler, useCallback, useMemo, useState } from "react";
import ProgressListItem from "./ProgressListItem";

export default function ProgressMonthList({
  username,
  date,
  progressList,
}: {
  username: string;
  date: string;
  progressList: ProgressListResponse;
}) {
  const [checkList, setCheckList] = useState<string[]>([]);

  const merged = useMemo(() => {
    return createMonthRange(date).map(
      (dateObj) =>
        progressList.results.find(
          (progress) => progress.date === dateObj.date
        ) || dateObj
    );
  }, [date, progressList.results]);

  const allChecked = useMemo(() => {
    return (
      progressList.results.length >= 1 &&
      progressList.results.every((pro) => checkList.includes(pro.date))
    );
  }, [checkList, progressList.results]);

  const handleCheckAll: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { checked } }) => {
      if (checked)
        setCheckList(progressList.results.map((progress) => progress.date));
      else setCheckList([]);
    },
    [progressList.results]
  );

  const handleCheck: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { checked, value } }) => {
      if (checked) setCheckList((prev) => [...prev, value]);
      else setCheckList((prev) => prev.filter((id) => id !== value));
    },
    []
  );

  const reset = useCallback(() => setCheckList([]), []);

  return (
    <div>
      <div className="grid grid-cols-[auto_repeat(8,_minmax(0,_1fr))_5fr]">
        <div className="grid place-content-center border-b-[1px] p-2 font-bold">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={allChecked}
          />
        </div>
        <div className="border-b-[1px] p-2 font-bold">Date</div>
        <div className="border-b-[1px] p-2 font-bold">Day</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Energy</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Week Avg</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Month Avg</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Weight</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Week Avg</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Month Avg</div>
        <div className="border-b-[1px] p-2 font-bold">Notes</div>
        {merged.map((progress) => (
          <ProgressListItem
            username={username}
            key={progress.date}
            // @ts-ignore
            progress={progress}
            isChecked={checkList}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <div className="pt-4">
        <DeleteDateRangeForm
          dateRange={checkList}
          handleUncheckAll={reset}
          url={`progress/delete-date-range`}
          revalidate={`/users/[username]/progress-month`}
          username={username}
        />
      </div>
    </div>
  );
}
