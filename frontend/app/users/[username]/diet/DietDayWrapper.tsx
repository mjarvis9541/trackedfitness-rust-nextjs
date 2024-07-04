"use client";

import DeleteIdRangeFormFormN from "@/components/DeleteIdRangeFormN";
import { ChangeEventHandler, useCallback, useState } from "react";
import DietDayFooter from "./DietDayFooter";
import DietDayFooterTotal from "./DietDayFooterTotal";
import DietMealWrapper from "./DietMealWrapper";

export default function DietDayWrapper({
  date,
  dietList,
  dietTarget,
  dietWeekAvg,
  mealOfDayList,
  username,
}: {
  date: string;
  dietList: Diet[];
  dietTarget: DietTarget;
  dietWeekAvg: BaseDiet;
  mealOfDayList: MealOfDayAPIResponse;
  username: string;
}) {
  const [mainChecked, setMainChecked] = useState<string[]>([]);

  const handleChecker: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { checked, value } }) => {
      if (checked) {
        setMainChecked((prev) => [...prev, value]);
      } else {
        setMainChecked((prev) => prev.filter((id) => id !== value));
      }
    },
    []
  );

  return (
    <>
      <div className="grid grid-cols-[auto_1.5fr_repeat(11,_minmax(0,_1fr))]">
        {mealOfDayList.results.map((meal) => (
          <DietMealWrapper
            date={date}
            key={meal.id}
            mainChecked={mainChecked}
            handleChecker={handleChecker}
            setMainChecked={setMainChecked}
            username={username}
            meal={meal}
            mealList={dietList}
          />
        ))}
        <div className="col-span-full mt-2 bg-gray-100 pb-2"></div>
        <DietDayFooterTotal diet={dietList?.[0]} title="Total" />
        <DietDayFooter diet={dietTarget} title="Target" />
        <DietDayFooter diet={dietWeekAvg} title="Week Average" />
      </div>
      <div className="mt-4">
        {/* <pre>{JSON.stringify(mainChecked, null, 2)}</pre> */}
        <DeleteIdRangeFormFormN
          handleUncheckAll={() => {
            setMainChecked([]);
          }}
          idRange={mainChecked}
          revalidate={`/users/[username]/diet`}
          url={`diet/delete-id-range`}
          username={username}
        />
      </div>
    </>
  );
}
