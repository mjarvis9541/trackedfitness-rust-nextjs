import { formatShortDate, formatShortDateTime } from "@/lib/format-date";

export default function AdminDetail({ data }: { data: any }) {
  return (
    <table className="w-full border-collapse">
      <tbody>
        <tr>
          <th className="w-1/4 border p-2 text-left">Id</th>
          <td className="w-3/4 border p-2 text-left">{data.id}</td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">User Id</th>
          <td className="w-3/4 border p-2 text-left">{data.user_id || "-"}</td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Date</th>
          <td className="w-3/4 border p-2 text-left">
            {data.date ? formatShortDate(data.date) : "-"}
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Slug</th>
          <td className="w-3/4 border p-2 text-left">{data.slug || "-"}</td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Created by</th>
          <td className="w-3/4 border p-2 text-left">
            {data.created_by || "-"}
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Updated by</th>
          <td className="w-3/4 border p-2 text-left">
            {data.updated_by || "-"}
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Created at</th>
          <td className="w-3/4 border p-2 text-left">
            {formatShortDateTime(data.created_at)}
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Updated at</th>
          <td className="w-3/4 border p-2 text-left">
            {data.updated_at ? formatShortDateTime(data.updated_at) : "-"}
          </td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Created by Id</th>
          <td className="w-3/4 border p-2 text-left">{data.created_by_id}</td>
        </tr>
        <tr>
          <th className="w-1/4 border p-2 text-left">Updated by Id</th>
          <td className="w-3/4 border p-2 text-left">
            {data.updated_by_id || "-"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
