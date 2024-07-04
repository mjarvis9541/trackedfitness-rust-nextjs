import { ChangeEventHandler } from "react";
import DietMealFooter from "./DietMealFooter";
import DietMealHeader from "./DietMealHeader";
import DietMealItem from "./DietMealItem";

export default function DietMealWrapper({
  date,
  handleChecker,
  mainChecked,
  meal,
  mealList,
  setMainChecked,
  username,
}: {
  date: string;
  handleChecker: ChangeEventHandler<HTMLInputElement>;
  mainChecked: string[];
  meal: MealOfDay;
  mealList: Diet[];
  setMainChecked: React.Dispatch<React.SetStateAction<string[]>>;
  username: string;
}) {
  const dietList = mealList.filter((diet) => diet.meal_name == meal.name);
  const dietIdList = dietList.map((diet) => diet.id);

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { checked },
  }) => {
    if (checked) {
      setMainChecked((prev) => [...new Set([...prev, ...dietIdList])]);
    } else {
      setMainChecked((prev) => prev.filter((id) => !dietIdList.includes(id)));
    }
  };

  return (
    <div className="bg-red contents pb-5">
      <DietMealHeader
        meal={meal}
        dietIdList={dietIdList}
        handleChange={handleChange}
        mainChecked={mainChecked}
      />
      {dietList.map((diet) => (
        <DietMealItem
          key={diet.id}
          diet={diet}
          mainChecked={mainChecked}
          handleChecker={handleChecker}
        />
      ))}
      <DietMealFooter
        dietList={dietList}
        username={username}
        date={date}
        meal={meal}
      />
    </div>
  );
}
