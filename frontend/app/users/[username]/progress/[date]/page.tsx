import ProgressDetail from "@/app/users/[username]/progress/ProgressDetail";
import AdminDetail from "@/components/AdminDetail";
import { API } from "@/lib/constants";
import { formatShortDateStr } from "@/lib/format-date";
import { cookies } from "next/headers";
import Link from "next/link";

async function getProgress(username: string, date: string): Promise<Progress> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/progress/user/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default async function UserProgressDetailPage({
  params: { username, date },
}: {
  params: { username: string; date: string };
}) {
  const progress = await getProgress(username, date);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <div className="flex justify-between">
              <h1 className="Log mb-3 text-xl font-bold">Progress Log</h1>
              <div className="mb-3 font-bold">
                {formatShortDateStr(progress.date)}
              </div>
            </div>

            <ProgressDetail progress={progress} />
            <p className="mb-2 mt-4">
              <Link
                href={`/users/${username}/progress/${date}/edit`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
            </p>
            <p>
              <Link
                href={`/users/${username}/progress/${date}/delete`}
                className="text-blue-500 hover:underline"
              >
                Delete
              </Link>
            </p>
          </div>
        </div>
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h2 className="mb-3 text-xl font-bold">Admin</h2>
            <AdminDetail data={progress} />
          </div>
        </div>
      </div>
    </main>
  );
}
