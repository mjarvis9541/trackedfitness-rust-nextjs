import { formatShortDateTime } from "@/lib/format-date";
import Link from "next/link";

export default async function TargetDetail({
  promise,
  username,
}: {
  promise: Promise<DietTarget>;
  username: string;
}) {
  const target = await promise;
  if (!target) {
    return (
      <Link
        href={`/users/${username}/diet-targets/create`}
        className="mb-3 text-blue-500 hover:underline"
      >
        Create Diet Target
      </Link>
    );
  }
  return (
    <>
      <table className="w-full border-collapse border">
        <tbody>
          <tr>
            <th className="w-1/2 border p-2 text-left">Date</th>
            <td className="w-1/2 border p-2 text-right">{target.date}</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Weight</th>
            <td className="border p-2 text-right">
              {Number(target.weight).toFixed(2)}kg
            </td>
          </tr>
          <tr>
            <th className="w-1/2 border p-2 text-left">Calories</th>
            <td className="w-1/2 border p-2 text-right">
              {Number(target.energy).toFixed(0)}kcal
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Protein</th>
            <td className="border p-2 text-right">
              {Number(target.protein).toFixed(0)}g{" "}
              <span className="text-xs text-gray-400">
                ({Number(target.protein_pct).toFixed(2)}%)
              </span>
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Carbohydrate</th>
            <td className="border p-2 text-right">
              {Number(target.carbohydrate).toFixed(0)}g{" "}
              <span className="text-xs text-gray-400">
                ({Number(target.carbohydrate_pct).toFixed(2)}%)
              </span>
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Fat</th>
            <td className="border p-2 text-right">
              {Number(target.fat).toFixed(0)}g{" "}
              <span className="text-xs text-gray-400">
                ({Number(target.fat_pct).toFixed(2)}%)
              </span>
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Saturates</th>
            <td className="border p-2 text-right">
              {Number(target.saturates).toFixed(0)}g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Sugars</th>
            <td className="border p-2 text-right">
              {Number(target.sugars).toFixed(0)}g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Fibre</th>
            <td className="border p-2 text-right">
              {Number(target.fibre).toFixed(0)}g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Salt</th>
            <td className="border p-2 text-right">
              {Number(target.salt).toFixed(0)}g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Calories per kg</th>
            <td className="border p-2 text-right">
              {Number(target.energy_per_kg).toFixed(0)}kcal
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Protein per kg</th>
            <td className="border p-2 text-right">
              {Number(target.protein_per_kg).toFixed(2)}g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Carbohydrate per kg</th>
            <td className="border p-2 text-right">
              {Number(target.carbohydrate_per_kg).toFixed(2)}g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Fat per kg</th>
            <td className="border p-2 text-right">
              {Number(target.fat_per_kg).toFixed(2)}g
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Created at</th>
            <td className="w-3/4 border p-2 text-right">
              {target.created_at ? formatShortDateTime(target.created_at) : "-"}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Updated at</th>
            <td className="w-3/4 border p-2 text-right">
              {target.updated_at ? formatShortDateTime(target.updated_at) : "-"}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex gap-4">
        <Link
          href={`/users/${username}/diet-targets/${target.date}/edit`}
          className="text-blue-500 hover:underline"
        >
          Edit
        </Link>
        <Link
          href={`/users/${username}/diet-targets/${target.date}/delete`}
          className="text-blue-500 hover:underline"
        >
          Delete
        </Link>
      </div>
    </>
  );
}
