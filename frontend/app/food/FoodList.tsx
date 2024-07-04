"use client";

import DeleteIdRangeFormFormN from "@/components/DeleteIdRangeFormN";
import useCheckIds from "@/hooks/useCheckIds";
import FoodListHeader from "./FoodListHeader";
import FoodListItem from "./FoodListItem";

export default function FoodList({ foodList }: { foodList: FoodListResponse }) {
  const { handleCheck, handleCheckAll, reset, checkList, allChecked } =
    useCheckIds({ dataList: foodList.results });

  return (
    <>
      <div className="grid grid-cols-[auto_2.2fr_repeat(11,_minmax(0,_1fr))_auto_auto_auto]">
        <FoodListHeader
          title="Food"
          subtitle="Brand"
          handleCheckAll={handleCheckAll}
          isAllChecked={allChecked}
        />
        {foodList.results.map((food) => (
          <FoodListItem
            key={food.id}
            food={food}
            isChecked={checkList}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <div className="mt-4">
        <DeleteIdRangeFormFormN
          handleUncheckAll={reset}
          idRange={checkList}
          revalidate={`/food/[slug]`}
          url={`food/delete-id-range`}
          username={``}
        />
      </div>
    </>
  );
}
