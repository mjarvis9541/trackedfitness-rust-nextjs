"use client";

import DeleteDateRangeForm from "@/components/DeleteDateRangeForm";
import useCheckDates from "@/hooks/useCheckDates";
import createMonthRange from "@/lib/create-month-range";
import { useMemo } from "react";
import DietTotalListItem from "./DietTotalListItem";

export default function DietTotalMonthList({
  date,
  dietTotalList,
  username,
}: {
  date: string;
  dietTotalList: DietDayTotal[];
  username: string;
}) {
  const merged = useMemo(() => {
    return createMonthRange(date).map(
      (dateObj) =>
        dietTotalList.find((dietTotal) => dietTotal.date === dateObj.date) || {
          ...dateObj,
          energy: 0,
          fat: 0,
          saturates: 0,
          carbohydrate: 0,
          sugars: 0,
          fibre: 0,
          protein: 0,
          salt: 0,
          protein_pct: 0,
          carbohydrate_pct: 0,
          fat_pct: 0,
          energy_per_kg: 0,
          protein_per_kg: 0,
          carbohydrate_per_kg: 0,
          fat_per_kg: 0,
          latest_weight: 0,
        }
    );
  }, [date, dietTotalList]);

  const { checkList, allChecked, handleCheck, handleCheckAll, reset } =
    useCheckDates({ dataList: merged });

  return (
    <>
      <div className="grid md:grid-cols-[auto_repeat(15,_minmax(0,_1fr))]">
        <div className="border-b-[1px] p-2 font-bold">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={allChecked}
          />
        </div>
        <div className="border-b-[1px] p-2 font-bold">Date</div>
        <div className="border-b-[1px] p-2 font-bold">Day</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Calories</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Protein</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Carbs</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Fat</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Saturates</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Sugars</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Fibre</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Salt</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Cals/kg</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Pro/kg</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Carbs/kg</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Fat/kg</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Weight</div>
        {merged.map((dietTotal) => (
          <DietTotalListItem
            key={dietTotal.date}
            username={username}
            // @ts-ignore
            dietTotal={dietTotal}
            isChecked={checkList}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <div className="pt-4">
        <DeleteDateRangeForm
          dateRange={checkList}
          handleUncheckAll={reset}
          url={`diet/delete-date-range`}
          revalidate={`/users/[username]/diet-total-month`}
          username={username}
        />
      </div>
    </>
  );
}
