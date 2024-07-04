import Link from "next/link";

export default function DietMealFooter({
  dietList,
  date,
  meal,
  username,
}: {
  date: string;
  dietList: Diet[];
  meal: MealOfDay;
  username: string;
}) {
  let food = dietList[0];
  let total = {
    energy: food ? Number(food.meal_energy).toFixed(0) : 0,
    protein: food ? Number(food.meal_protein).toFixed(0) : 0,
    carbohydrate: food ? Number(food.meal_carbohydrate).toFixed(0) : 0,
    fat: food ? Number(food.meal_fat).toFixed(0) : 0,
    saturates: food ? Number(food.meal_saturates).toFixed(0) : 0,
    sugars: food ? Number(food.meal_sugars).toFixed(0) : 0,
    fibre: food ? Number(food.meal_fibre).toFixed(0) : 0,
    salt: food ? Number(food.meal_salt).toFixed(1) : "0.0",
  };

  return (
    <>
      <div className="col-span-5 flex items-center justify-between gap-2 bg-gray-100 py-1 pl-2 pr-2">
        <div className="flex gap-4">
          <Link
            href={`/users/${username}/diet/${date}/${meal.slug}/add-food`}
            className="text-blue-500 hover:underline"
          >
            Add Food
          </Link>
          <Link
            href={`/users/${username}/diet/${date}/${meal.slug}/add-meal`}
            className="text-blue-500 hover:underline"
          >
            Add Meal
          </Link>
          <Link
            href={`/users/${username}/diet/${date}/${meal.slug}/copy-from`}
            className="text-blue-500 hover:underline"
          >
            Copy From
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {total.energy}kcal
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {total.protein}g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {total.carbohydrate}g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {total.fat}g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {total.saturates}g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {total.sugars}g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {total.fibre}g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {total.salt}g
      </div>
      <div className="col-span-full py-2"></div>
    </>
  );
}
