import createWeekRange from "@/lib/create-week-range";
import DietListItem from "./DietListItem";

type isoDate = {
  date: string;
};

export default async function DietList({
  date,
  username,
  promise,
}: {
  date: string;
  username: string;
  promise: Promise<Array<BaseDiet>>;
}) {
  const dietList = await promise;

  const weekRange = createWeekRange(date);
  const merged = weekRange.map((dateObj: isoDate) => {
    const diet = dietList.find((diet) => diet.date === dateObj.date);
    if (diet) return diet;
    return {
      ...dateObj,
      // macros
      energy: "",
      protein: "",
      carbohydrate: "",
      fat: "",
      saturates: "",
      sugars: "",
      fibre: "",
      salt: "",
      // pct
      protein_pct: "",
      carbohydrate_pct: "",
      fat_pct: "",
      // pkg
      energy_per_kg: "",
      protein_per_kg: "",
      carbohydrate_per_kg: "",
      fat_per_kg: "",
      // weight
      latest_weight: "",
      latest_weight_date: "",
    };
  });

  return (
    <>
      {merged.map((diet) => (
        <DietListItem key={diet.date} username={username} diet={diet} />
      ))}
    </>
  );
}
