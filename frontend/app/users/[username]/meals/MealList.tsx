"use client";

import DeleteIdRangeFormFormN from "@/components/DeleteIdRangeFormN";
import useCheckIds from "@/hooks/useCheckIds";
import MealListItem from "./MealListItem";

export default function MealList({
  mealList,
  username,
}: {
  mealList: Meal[];
  username: string;
}) {
  const { checkList, allChecked, handleCheck, handleCheckAll, reset } =
    useCheckIds({ dataList: mealList });

  return (
    <>
      <div className="grid grid-cols-[auto_4fr_repeat(9,_minmax(0,_1fr))]">
        <div className="border-b-[1px] p-2">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={allChecked}
          />
        </div>
        <div className="border-b-[1px] p-2 font-bold">Meal</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Food</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Calories</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Protein</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Carbs</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Fat</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Saturates</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Sugars</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Fibre</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Salt</div>
        {mealList.map((meal) => (
          <MealListItem
            key={meal.id}
            meal={meal}
            username={username}
            isChecked={checkList}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <div className="mt-4">
        <DeleteIdRangeFormFormN
          handleUncheckAll={reset}
          idRange={checkList}
          revalidate={`/users/[username]/meals`}
          url={`meals/delete-id-range`}
          username={username}
        />
      </div>
    </>
  );
}
