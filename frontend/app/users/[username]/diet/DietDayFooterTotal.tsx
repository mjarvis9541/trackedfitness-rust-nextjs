export default function DietDayFooterTotal({
  diet,
  title,
}: {
  diet?: any;
  title: string;
}) {
  return (
    <div className="group contents">
      <div className="col-span-5 bg-gray-100 p-2 pt-0 font-bold">
        {title} <br />
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.day_energy ? Number(diet.day_energy).toFixed(0) : 0}kcal
        <br />
        <span className="ml-1 text-xs text-gray-400">
          {diet?.day_energy_per_kg
            ? Number(diet.day_energy_per_kg).toFixed(0)
            : 0}
          kcal
        </span>
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.day_protein ? Number(diet.day_protein).toFixed(0) : 0}g
        <span className="ml-1 text-xs text-gray-400">
          ({diet?.day_protein_pct ? Number(diet.day_protein_pct).toFixed(0) : 0}
          %)
        </span>
        <br />
        <span className="ml-1 text-xs text-gray-400">
          {diet?.day_protein_per_kg
            ? Number(diet.day_protein_per_kg).toFixed(2)
            : 0}
          g
        </span>
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.day_carbohydrate ? Number(diet.day_carbohydrate).toFixed(0) : 0}g
        <span className="ml-1 text-xs text-gray-400">
          (
          {diet?.day_carbohydrate_pct
            ? Number(diet.day_carbohydrate_pct).toFixed(0)
            : 0}
          %)
        </span>
        <br />
        <span className="ml-1 text-xs text-gray-400">
          {diet?.day_carbohydrate_per_kg
            ? Number(diet.day_carbohydrate_per_kg).toFixed(2)
            : 0}
          g
        </span>
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.day_fat ? Number(diet.day_fat).toFixed(0) : 0}g
        <span className="ml-1 text-xs text-gray-400">
          ({diet?.day_fat_pct ? Number(diet.day_fat_pct).toFixed(0) : 0}%)
        </span>
        <br />
        <span className="text- ml-1 text-xs text-gray-400">
          {diet?.day_fat_per_kg ? Number(diet.day_fat_per_kg).toFixed(2) : 0}g
        </span>
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.day_saturates ? Number(diet.day_saturates).toFixed(0) : 0}g
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.day_sugars ? Number(diet.day_sugars).toFixed(0) : 0}g
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.day_fibre ? Number(diet.day_fibre).toFixed(0) : 0}g
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.day_salt ? Number(diet.day_salt).toFixed(1) : "0.0"}g
      </div>
    </div>
  );
}
