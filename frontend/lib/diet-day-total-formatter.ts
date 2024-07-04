export default function dietDayTotalFormatter({
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
    energy: diet?.day_energy
      ? Number(diet.day_energy).toFixed(energyPlaces)
      : empty,
    fat: diet?.day_fat ? Number(diet.day_fat).toFixed(places) : empty,
    saturates: diet?.day_saturates
      ? Number(diet.day_saturates).toFixed(places)
      : empty,
    carbohydrate: diet?.day_carbohydrate
      ? Number(diet.day_carbohydrate).toFixed(places)
      : empty,
    sugars: diet?.day_sugars ? Number(diet.day_sugars).toFixed(places) : empty,
    fibre: diet?.day_fibre ? Number(diet.day_fibre).toFixed(places) : empty,
    protein: diet?.day_protein
      ? Number(diet.day_protein).toFixed(places)
      : empty,
    salt: diet?.day_salt
      ? Number(diet.day_salt).toFixed(placesSalt)
      : emptySalt,
    protein_pct: diet?.day_protein_pct
      ? Number(diet.day_protein_pct).toFixed(placesPct)
      : emptyPct,
    carbohydrate_pct: diet?.day_carbohydrate_pct
      ? Number(diet.day_carbohydrate_pct).toFixed(placesPct)
      : emptyPct,
    fat_pct: diet?.day_fat_pct
      ? Number(diet.day_fat_pct).toFixed(placesPct)
      : emptyPct,
    weight: diet?.weight
      ? Number(diet.weight).toFixed(placesWeight)
      : emptyWeight,
    // day
    energy_per_kg: diet?.day_energy_per_kg
      ? Number(diet.day_energy_per_kg).toFixed(energyPlaces)
      : empty,
    protein_per_kg: diet?.day_protein_per_kg
      ? Number(diet.day_protein_per_kg).toFixed(placesPkg)
      : emptyPkg,
    carbohydrate_per_kg: diet?.day_carbohydrate_per_kg
      ? Number(diet.day_carbohydrate_per_kg).toFixed(placesPkg)
      : emptyPkg,
    fat_per_kg: diet?.day_fat_per_kg
      ? Number(diet.day_fat_per_kg).toFixed(placesPkg)
      : emptyPkg,
    latest_weight: diet?.latest_weight
      ? Number(diet.latest_weight).toFixed(placesWeight)
      : emptyWeight,
  };
  return formatted;
}
