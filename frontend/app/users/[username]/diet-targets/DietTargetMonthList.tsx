"use client";

import DeleteDateRangeForm from "@/components/DeleteDateRangeForm";
import useCheckDates from "@/hooks/useCheckDates";
import createMonthRange from "@/lib/create-month-range";
import { useMemo } from "react";
import DietTargetListItem from "./DietTargetListItem";

export default function DietTargetMonthList({
  date,
  dietTargetList,
  username,
}: {
  date: string;
  dietTargetList: DietTarget[];
  username: string;
}) {
  const merged = useMemo(() => {
    return createMonthRange(date).map((dateObj: any) => {
      const dietTarget = dietTargetList.find(
        (dietTarget) => dietTarget.date === dateObj.date
      );
      if (dietTarget) return { ...dateObj, ...dietTarget };
      return {
        ...dateObj,
        energy: 0,
        protein: 0,
        carbohydrate: 0,
        fat: 0,
        saturates: 0,
        sugars: 0,
        fibre: 0,
        salt: 0,
        protein_pct: 0,
        carbohydrate_pct: 0,
        fat_pct: 0,
        energy_per_kg: 0,
        protein_per_kg: 0,
        carbohydrate_per_kg: 0,
        fat_per_kg: 0,
        latest_weight: 0,
      };
    });
  }, [date, dietTargetList]);

  const { checkList, allChecked, handleCheck, handleCheckAll, reset } =
    useCheckDates({ dataList: merged });

  return (
    <div>
      <div className="grid md:grid-cols-[auto_repeat(15,_minmax(0,_1fr))]">
        <div className="border-b-[1px] p-2">
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
        {merged.map((dietTarget) => (
          <DietTargetListItem
            key={dietTarget.date}
            username={username}
            dietTarget={dietTarget}
            isChecked={checkList}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <div className="pt-4">
        <DeleteDateRangeForm
          url={`diet-targets/delete-date-range`}
          revalidate={`/users/[username]/diet-target-month`}
          username={username}
          dateRange={checkList}
          handleUncheckAll={reset}
        />
      </div>
    </div>
  );
}
