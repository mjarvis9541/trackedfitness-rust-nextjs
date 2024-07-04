import { formatShortDateTime } from "@/lib/format-date";

export default function ProgressDetail({ progress }: { progress: Progress }) {
  return (
    <table className="w-full border-collapse border">
      <tbody>
        <tr>
          <th className="w-1/2 border p-2 text-left">Date</th>
          <td className="w-1/2 border p-2 text-right">{progress.date}</td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Weight (kg)</th>
          <td className="w-1/2 border p-2 text-right">
            {Number(progress.weight_kg).toFixed(2)}kg
          </td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Week Avg</th>
          <td className="w-1/2 border p-2 text-right">
            {Number(progress.week_avg_weight).toFixed(2)}kg
          </td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Month Avg</th>
          <td className="w-1/2 border p-2 text-right">
            {Number(progress.month_avg_weight).toFixed(2)}kg
          </td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Energy Burnt (kcal)</th>
          <td className="w-1/2 border p-2 text-right">
            {Number(progress.energy_burnt).toFixed(0)}kcal
          </td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Week Avg</th>
          <td className="w-1/2 border p-2 text-right">
            {Number(progress.week_avg_energy).toFixed(0)}kcal
          </td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Month Avg</th>
          <td className="w-1/2 border p-2 text-right">
            {Number(progress.month_avg_energy).toFixed(0)}kcal
          </td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Notes</th>
          <td className="w-1/2 border p-2 text-left">{progress.notes}</td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Created at</th>
          <td className="w-1/2 border p-2 text-right">
            {formatShortDateTime(progress.created_at)}
          </td>
        </tr>
        <tr>
          <th className="w-1/2 border p-2 text-left">Updated at</th>
          <td className="w-1/2 border p-2 text-right">
            {progress.updated_at
              ? formatShortDateTime(progress.updated_at)
              : "-"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
