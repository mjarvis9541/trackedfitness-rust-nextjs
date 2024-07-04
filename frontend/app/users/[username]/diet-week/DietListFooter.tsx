export default async function DietListFooter({
  title,
  promise,
}: {
  title: string;
  promise: Promise<BaseDiet>;
}) {
  const diet = await promise;
  return (
    <div className="group contents">
      <div className="col-span-3 bg-gray-100 p-2 font-bold text-gray-900">
        {title}
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.energy).toFixed(0)}kcal
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.protein).toFixed(0)}g
        <span className="ml-1 text-end text-xs text-gray-400">
          ({Number(diet.protein_pct).toFixed(0)}%)
        </span>
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.carbohydrate).toFixed(0)}g
        <span className="ml-1 text-end text-xs text-gray-400">
          ({Number(diet.carbohydrate_pct).toFixed(0)}%)
        </span>
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.fat).toFixed(0)}g
        <span className="ml-1 text-end text-xs text-gray-400">
          ({Number(diet.fat_pct).toFixed(0)}%)
        </span>
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.saturates).toFixed(0)}g
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.sugars).toFixed(0)}g
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.fibre).toFixed(0)}g
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.salt).toFixed(2)}g
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.energy_per_kg).toFixed(0)}kcal
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.protein_per_kg).toFixed(2)}g
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.carbohydrate_per_kg).toFixed(2)}g
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.fat_per_kg).toFixed(2)}g
      </div>
      <div className="bg-gray-100 p-2 text-end text-gray-900">
        {Number(diet.latest_weight).toFixed(0)}kg
      </div>
    </div>
  );
}
