import DietAddFoodListItem from "./DietAddFoodListItem";

export default function DietAddFoodList({
  date,
  foodList,
  meal,
  username,
}: {
  date: string;
  foodList: FoodListResponse;
  meal: MealOfDay;
  username: string;
}) {
  return (
    <div className="grid grid-cols-[2fr_repeat(12,_minmax(0,_1fr))]">
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
      <div className="border-b-[1px] p-2 text-end font-bold"></div>
      {foodList.results.map((food) => (
        <DietAddFoodListItem
          key={food.id}
          food={food}
          meal={meal}
          username={username}
          date={date}
        />
      ))}
    </div>
  );
}
