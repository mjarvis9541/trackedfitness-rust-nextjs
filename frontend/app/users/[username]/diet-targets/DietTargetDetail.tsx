import dietFormatter from "@/lib/diet-formatter";
import { formatShortDateTime } from "@/lib/format-date";

export default function DietTargetDetail({
  dietTarget,
}: {
  dietTarget: DietTarget;
}) {
  const diet = dietFormatter({ diet: dietTarget, placesPct: 2, placesPkg: 2 });

  return (
    <table className="w-full border-collapse border">
      <tbody>
        <tr>
          <th className="w-1/2 border p-2 text-left">Date</th>
          <td className="w-1/2 border p-2 text-right">{dietTarget.date}</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Weight</th>
          <td className="border p-2 text-right">{diet.weight || 0}kg</td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Calories</th>
          <td className="w-1/2 border p-2 text-right">{diet.energy}kcal</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein</th>
          <td className="border p-2 text-right">
            {diet.protein}g{" "}
            <span className="text-xs text-gray-400">({diet.protein_pct}%)</span>
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate</th>
          <td className="border p-2 text-right">
            {diet.carbohydrate}g{" "}
            <span className="text-xs text-gray-400">
              ({diet.carbohydrate_pct}%)
            </span>
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat</th>
          <td className="border p-2 text-right">
            {diet.fat}g{" "}
            <span className="text-xs text-gray-400">({diet.fat_pct}%)</span>
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Saturates</th>
          <td className="border p-2 text-right">{diet.saturates}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Sugars</th>
          <td className="border p-2 text-right">{diet.sugars}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fibre</th>
          <td className="border p-2 text-right">{diet.fibre}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Salt</th>
          <td className="border p-2 text-right">{diet.salt}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Calories per kg</th>
          <td className="border p-2 text-right">
            {dietTarget.energy_per_kg || 0}kcal
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein per kg</th>
          <td className="border p-2 text-right">{diet.protein_per_kg || 0}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate per kg</th>
          <td className="border p-2 text-right">
            {diet.carbohydrate_per_kg || 0}g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat per kg</th>
          <td className="border p-2 text-right">{diet.fat_per_kg || 0}g</td>
        </tr>

        <tr>
          <th className="w-1/4 border p-2 text-left">Created at</th>
          <td className="w-3/4 border p-2 text-right">
            {dietTarget.created_at
              ? formatShortDateTime(dietTarget.created_at)
              : "-"}
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Updated at</th>
          <td className="w-3/4 border p-2 text-right">
            {dietTarget.updated_at
              ? formatShortDateTime(dietTarget.updated_at)
              : "-"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
