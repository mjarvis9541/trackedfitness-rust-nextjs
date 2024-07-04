import foodFormatter from "@/lib/food-formatter";

export default function FoodDetail({ food }: { food: any }) {
  const formatted = foodFormatter({ food, places: 1 });
  return (
    <table className="mb-3 w-full border-collapse border">
      <thead>
        <tr>
          <th className="w-1/3 border p-2 text-left">Typical Values</th>
          <th className="w-1/3 border p-2 text-right">
            Per {Number(food.data_value)}
            {food.data_measurement}
          </th>
          <th className="w-1/3 border p-2 text-right">
            Per {}
            {food.data_measurement}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th className="border p-2 text-left">Energy (kcal)</th>
          <td className="border p-2 text-right">{food.energy}kcal</td>
          <td className="border p-2 text-right">{}kcal</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein</th>
          <td className="border p-2 text-right">{formatted.protein}g</td>
          <td className="border p-2 text-right">{}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate</th>
          <td className="border p-2 text-right">{formatted.carbohydrate}g</td>
          <td className="border p-2 text-right">{}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat</th>
          <td className="border p-2 text-right">{formatted.fat}g</td>
          <td className="border p-2 text-right">{}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Saturates</th>
          <td className="border p-2 text-right">{formatted.saturates}g</td>
          <td className="border p-2 text-right">{}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Sugars</th>
          <td className="border p-2 text-right">{formatted.sugars}g</td>
          <td className="border p-2 text-right">{}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fibre</th>
          <td className="border p-2 text-right">{formatted.fibre}g</td>
          <td className="border p-2 text-right">{}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Salt</th>
          <td className="border p-2 text-right">{formatted.salt}g</td>
          <td className="border p-2 text-right">{}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein %</th>
          <td className="border p-2 text-right text-sm text-gray-400">
            {formatted.protein_pct}%
          </td>
          <td className="border p-2 text-right">{}%</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate %</th>
          <td className="border p-2 text-right text-sm text-gray-400">
            {formatted.carbohydrate_pct}%
          </td>
          <td className="border p-2 text-right">{}%</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat %</th>
          <td className="border p-2 text-right text-sm text-gray-400">
            {formatted.fat_pct}%
          </td>
          <td className="border p-2 text-right">{}%</td>
        </tr>
      </tbody>
    </table>
  );
}
