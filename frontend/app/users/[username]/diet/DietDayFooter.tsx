export default function DietDayFooter({
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
        {diet?.energy ? Number(diet.energy).toFixed(0) : 0}kcal
        <br />
        <span className="ml-1 text-xs text-gray-400">
          {diet?.energy_per_kg ? Number(diet.energy_per_kg).toFixed(0) : 0}
          kcal
        </span>
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.protein ? Number(diet.protein).toFixed(0) : 0}g
        <span className="ml-1 text-xs text-gray-400">
          ({diet?.protein_pct ? Number(diet.protein_pct).toFixed(0) : 0}%)
        </span>
        <br />
        <span className="ml-1 text-xs text-gray-400">
          {diet?.protein_per_kg ? Number(diet.protein_per_kg).toFixed(2) : 0}g
        </span>
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.carbohydrate ? Number(diet.carbohydrate).toFixed(0) : 0}g
        <span className="ml-1 text-xs text-gray-400">
          (
          {diet?.carbohydrate_pct
            ? Number(diet.carbohydrate_pct).toFixed(0)
            : 0}
          %)
        </span>
        <br />
        <span className="ml-1 text-xs text-gray-400">
          {diet?.carbohydrate_per_kg
            ? Number(diet.carbohydrate_per_kg).toFixed(2)
            : 0}
          g
        </span>
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.fat ? Number(diet.fat).toFixed(0) : 0}g
        <span className="ml-1 text-xs text-gray-400">
          ({diet?.fat_pct ? Number(diet.fat_pct).toFixed(0) : 0}%)
        </span>
        <br />
        <span className="text- ml-1 text-xs text-gray-400">
          {diet?.fat_per_kg ? Number(diet.fat_per_kg).toFixed(2) : 0}g
        </span>
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.saturates ? Number(diet.saturates).toFixed(0) : 0}g
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.sugars ? Number(diet.sugars).toFixed(0) : 0}g
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.fibre ? Number(diet.fibre).toFixed(0) : 0}g
      </div>
      <div className="bg-gray-100 p-2 pt-0 text-end font-bold">
        {diet?.salt ? Number(diet.salt).toFixed(1) : "0.0"}g
      </div>
    </div>
  );
}
