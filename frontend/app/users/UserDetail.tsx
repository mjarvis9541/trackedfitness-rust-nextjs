import { formatShortDateTime } from "@/lib/format-date";
import Link from "next/link";

export default async function UserDetail({
  promise,
  username,
}: {
  promise: Promise<User>;
  username: string;
}) {
  const user = await promise;

  return (
    <>
      <table className="w-full border-collapse border">
        <tbody>
          <tr>
            <th className="w-1/4 border p-2 text-left">Name</th>
            <td className="w-3/4 border p-2 text-left">{user.name}</td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Username</th>
            <td className="w-3/4 border p-2 text-left">{user.username}</td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Email</th>
            <td className="w-3/4 border p-2 text-left">{user.email}</td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Active</th>
            <td className="w-3/4 border p-2 text-left">
              {JSON.stringify(user.is_active, null, 2)}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Staff</th>
            <td className="w-3/4 border p-2 text-left">
              {JSON.stringify(user.is_staff, null, 2)}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Superuser</th>
            <td className="w-3/4 border p-2 text-left">
              {JSON.stringify(user.is_superuser, null, 2)}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Last Login</th>
            <td className="w-3/4 border p-2 text-left">
              {user.last_login ? formatShortDateTime(user.last_login) : "-"}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Created at</th>
            <td className="w-3/4 border p-2 text-left">
              {user.created_at ? formatShortDateTime(user.created_at) : "-"}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Updated at</th>
            <td className="w-3/4 border p-2 text-left">
              {user.updated_at ? formatShortDateTime(user.updated_at) : "-"}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex gap-4">
        <Link
          href={`/users/${username}/account/edit`}
          className="text-blue-500 hover:underline"
        >
          Edit
        </Link>
      </div>
    </>
  );
}
