import MealAddFoodListItem from "./MealAddFoodListItem";

export default function MealAddFoodList({
  foodList,
  mealId,
  username,
}: {
  foodList: FoodListResponse;
  mealId: string;
  username: string;
}) {
  return (
    <div className="grid grid-cols-4 bg-white md:grid-cols-[1.5fr_repeat(12,_minmax(0,_1fr))]">
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
        <MealAddFoodListItem
          food={food}
          key={food.id}
          mealId={mealId}
          username={username}
        />
      ))}
    </div>
  );
}
