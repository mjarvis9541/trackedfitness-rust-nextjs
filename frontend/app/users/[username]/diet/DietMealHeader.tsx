export default function DietMealHeader({
  meal,
  handleChange,
  mainChecked,
  dietIdList,
}: {
  meal: MealOfDay;
  dietIdList: string[];
  handleChange: any;
  mainChecked: string[];
}) {
  return (
    <>
      <div className="flex items-center justify-center border-b-[1px] p-2">
        <input
          type="checkbox"
          disabled={!dietIdList.length}
          onChange={handleChange}
          checked={
            dietIdList.length >= 1 &&
            dietIdList.every((diet) => mainChecked.includes(diet))
          }
        />
      </div>
      <div className="col-span-3 flex items-center justify-start border-b-[1px] p-2 font-bold capitalize">
        {meal.name}
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Quantity
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Calories
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Protein
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Carbs
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Fat
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Saturates
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Sugars
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Fibre
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 font-bold">
        Salt
      </div>
    </>
  );
}
