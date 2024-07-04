"use client";

import DeleteIdRangeFormFormN from "@/components/DeleteIdRangeFormN";
import useCheckIds from "@/hooks/useCheckIds";
import MealOfDayListItem from "./MealOfDayListItem";

export default function MealOfDayList({
  mealOfDayList,
}: {
  mealOfDayList: MealOfDayAPIResponse;
}) {
  const { handleCheck, handleCheckAll, reset, checkList, allChecked } =
    useCheckIds({ dataList: mealOfDayList.results });

  return (
    <>
      <div className="grid grid-cols-[auto_repeat(4,_minmax(0,_1fr))_auto_auto]">
        <div className="border-b-[1px] p-2 font-bold">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={allChecked}
          />
        </div>
        <div className="border-b-[1px] p-2 font-bold">Name</div>
        <div className="border-b-[1px] p-2 font-bold">Slug</div>
        <div className="border-b-[1px] p-2 font-bold">Order</div>
        <div className="border-b-[1px] p-2 font-bold">Created By</div>
        <div className="border-b-[1px] p-2 font-bold">Created At</div>
        <div className="border-b-[1px] p-2 font-bold">Updated At</div>
        {mealOfDayList.results.map((mealOfDay) => (
          <MealOfDayListItem
            key={mealOfDay.id}
            mealOfDay={mealOfDay}
            isChecked={checkList}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <div className="mt-4">
        <DeleteIdRangeFormFormN
          url={`meal-of-day/delete-id-range`}
          username={``}
          revalidate={`/meal-of-day/[slug]`}
          idRange={checkList}
          handleUncheckAll={reset}
        />
      </div>
    </>
  );
}
