"use client";

import DeleteIdRangeFormFormN from "@/components/DeleteIdRangeFormN";
import useCheckIds from "@/hooks/useCheckIds";
import MealFoodListItem from "./MealFoodListItem";

export default function MealFoodList({
  mealFoodList,
  username,
}: {
  mealFoodList: MealFoodListResponse[];
  username: string;
}) {
  const { handleCheck, handleCheckAll, reset, checkList, allChecked } =
    useCheckIds({ dataList: mealFoodList });

  return (
    <>
      <div className="grid grid-cols-[auto_1.5fr_repeat(11,_minmax(0,_1fr))] bg-white">
        <div className="border-b-[1px] p-2">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={allChecked}
          />
        </div>
        <div className="col-span-3 border-b-[1px] p-2 font-bold">Food</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Quantity</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Calories</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Protein</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Carbs</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Fat</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Saturates</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Sugars</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Fibre</div>
        <div className="border-b-[1px] p-2 text-end font-bold">Salt</div>
        {mealFoodList.map((mealFood) => (
          <MealFoodListItem
            key={mealFood.id}
            mealFood={mealFood}
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
          revalidate={`users/[username]/meals/[id]`}
          url={`meal-food/delete-id-range`}
          username={``}
        />
      </div>
    </>
  );
}
