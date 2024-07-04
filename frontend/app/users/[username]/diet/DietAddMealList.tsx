import DietAddMealListItem from "./DietAddMealListItem";

export default function DietAddMealList({
  date,
  mealOfDay,
  mealList,
  username,
}: {
  date: string;
  mealOfDay: MealOfDay;
  mealList: Meal[];
  username: string;
}) {
  return (
    <div className="grid grid-cols-[2fr_repeat(12,_minmax(0,_1fr))]">
      <div className="col-span-3 border-b-[1px] p-2 font-bold">Meal</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Food</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Calories</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Protein</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Carbs</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Fat</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Saturates</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Sugars</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Fibre</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Salt</div>
      <div className="border-b-[1px] p-2 text-end font-bold"></div>
      {mealList.map((meal) => (
        <DietAddMealListItem
          date={date}
          key={meal.id}
          meal={meal}
          mealOfDay={mealOfDay}
          username={username}
        />
      ))}
    </div>
  );
}
