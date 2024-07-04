export default function dietFormatter({
  diet,
  empty = "0",
  emptyPct = "0",
  emptyPkg = "0.0",
  emptySalt = "0.0",
  emptyWeight = "-",
  energyPlaces = 0,
  places = 0,
  placesPct = 0,
  placesPkg = 1,
  placesSalt = 2,
  placesWeight = 2,
}: {
  diet: DietDayTotal | DietTarget | any;
  empty?: string;
  emptyPct?: string;
  emptyPkg?: string;
  emptySalt?: string;
  emptyWeight?: string;
  energyPlaces?: number;
  places?: number;
  placesPct?: number;
  placesPkg?: number;
  placesSalt?: number;
  placesWeight?: number;
}) {
  let formatted = {
    ...diet,
    energy: diet?.energy ? Number(diet.energy).toFixed(energyPlaces) : empty,
    fat: diet?.fat ? Number(diet.fat).toFixed(places) : empty,
    saturates: diet?.saturates ? Number(diet.saturates).toFixed(places) : empty,
    carbohydrate: diet?.carbohydrate
      ? Number(diet.carbohydrate).toFixed(places)
      : empty,
    sugars: diet?.sugars ? Number(diet.sugars).toFixed(places) : empty,
    fibre: diet?.fibre ? Number(diet.fibre).toFixed(places) : empty,
    protein: diet?.protein ? Number(diet.protein).toFixed(places) : empty,
    salt: diet?.salt ? Number(diet.salt).toFixed(placesSalt) : emptySalt,
    protein_pct: diet?.protein_pct
      ? Number(diet.protein_pct).toFixed(placesPct)
      : emptyPct,
    carbohydrate_pct: diet?.carbohydrate_pct
      ? Number(diet.carbohydrate_pct).toFixed(placesPct)
      : emptyPct,
    fat_pct: diet?.fat_pct ? Number(diet.fat_pct).toFixed(placesPct) : emptyPct,
    energy_per_kg: diet?.energy_per_kg
      ? Number(diet.energy_per_kg).toFixed(energyPlaces)
      : empty,
    protein_per_kg: diet?.protein_per_kg
      ? Number(diet.protein_per_kg).toFixed(placesPkg)
      : emptyPkg,
    carbohydrate_per_kg: diet?.carbohydrate_per_kg
      ? Number(diet.carbohydrate_per_kg).toFixed(placesPkg)
      : emptyPkg,
    fat_per_kg: diet?.fat_per_kg
      ? Number(diet.fat_per_kg).toFixed(placesPkg)
      : emptyPkg,
    weight: diet?.weight
      ? Number(diet.weight).toFixed(placesWeight)
      : emptyWeight,
    // day
    day_energy_per_kg: diet?.day_energy_per_kg
      ? Number(diet.day_energy_per_kg).toFixed(energyPlaces)
      : empty,
    day_protein_per_kg: diet?.day_protein_per_kg
      ? Number(diet.day_protein_per_kg).toFixed(placesPkg)
      : emptyPkg,
    day_carbohydrate_per_kg: diet?.day_carbohydrate_per_kg
      ? Number(diet.day_carbohydrate_per_kg).toFixed(placesPkg)
      : emptyPkg,
    day_fat_per_kg: diet?.day_fat_per_kg
      ? Number(diet.day_fat_per_kg).toFixed(placesPkg)
      : emptyPkg,
    latest_weight: diet?.latest_weight
      ? Number(diet.latest_weight).toFixed(placesWeight)
      : emptyWeight,
  };
  return formatted;
}
