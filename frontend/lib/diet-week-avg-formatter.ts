export default function dietWeekAvgFormatter({
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
  placesSalt = 1,
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
    energy: diet?.week_avg_energy
      ? Number(diet.week_avg_energy).toFixed(energyPlaces)
      : empty,
    fat: diet?.week_avg_fat ? Number(diet.week_avg_fat).toFixed(places) : empty,
    saturates: diet?.week_avg_saturates
      ? Number(diet.week_avg_saturates).toFixed(places)
      : empty,
    carbohydrate: diet?.week_avg_carbohydrate
      ? Number(diet.week_avg_carbohydrate).toFixed(places)
      : empty,
    sugars: diet?.week_avg_sugars
      ? Number(diet.week_avg_sugars).toFixed(places)
      : empty,
    fibre: diet?.week_avg_fibre
      ? Number(diet.week_avg_fibre).toFixed(places)
      : empty,
    protein: diet?.week_avg_protein
      ? Number(diet.week_avg_protein).toFixed(places)
      : empty,
    salt: diet?.week_avg_salt
      ? Number(diet.week_avg_salt).toFixed(placesSalt)
      : emptySalt,
    protein_pct: diet?.week_avg_protein_pct
      ? Number(diet.week_avg_protein_pct).toFixed(placesPct)
      : emptyPct,
    carbohydrate_pct: diet?.week_avg_carbohydrate_pct
      ? Number(diet.week_avg_carbohydrate_pct).toFixed(placesPct)
      : emptyPct,
    fat_pct: diet?.week_avg_fat_pct
      ? Number(diet.week_avg_fat_pct).toFixed(placesPct)
      : emptyPct,
    weight: diet?.latest_weight
      ? Number(diet.latest_weight).toFixed(placesWeight)
      : emptyWeight,
    // day
    energy_per_kg: diet?.week_avg_energy_per_kg
      ? Number(diet.week_avg_energy_per_kg).toFixed(energyPlaces)
      : empty,
    protein_per_kg: diet?.week_avg_protein_per_kg
      ? Number(diet.week_avg_protein_per_kg).toFixed(placesPkg)
      : emptyPkg,
    carbohydrate_per_kg: diet?.week_avg_carbohydrate_per_kg
      ? Number(diet.week_avg_carbohydrate_per_kg).toFixed(placesPkg)
      : emptyPkg,
    fat_per_kg: diet?.week_avg_fat_per_kg
      ? Number(diet.week_avg_fat_per_kg).toFixed(placesPkg)
      : emptyPkg,
    latest_weight: diet?.latest_weight
      ? Number(diet.latest_weight).toFixed(placesWeight)
      : emptyWeight,
  };
  return formatted;
}
