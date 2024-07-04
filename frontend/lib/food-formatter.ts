export default function foodFormatter({
  food,
  places = 1,
  pctPlaces = 2,
}: {
  food: Food;
  places?: number;
  pctPlaces?: number;
}) {
  let formatted = {
    ...food,
    fat: Number(food.fat).toFixed(places),
    saturates: Number(food.saturates).toFixed(places),
    carbohydrate: Number(food.carbohydrate).toFixed(places),
    sugars: Number(food.sugars).toFixed(places),
    fibre: Number(food.fibre).toFixed(places),
    protein: Number(food.protein).toFixed(places),
    salt: Number(food.salt).toFixed(places + 1),
    protein_pct: Number(food.protein_pct).toFixed(pctPlaces),
    carbohydrate_pct: Number(food.carbohydrate_pct).toFixed(pctPlaces),
    fat_pct: Number(food.fat_pct).toFixed(pctPlaces),
  };
  return formatted;
}
