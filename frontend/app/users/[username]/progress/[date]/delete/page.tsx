import DeleteForm from "@/components/DeleteForm";
import { API } from "@/lib/constants";
import { formatShortDateStr } from "@/lib/format-date";
import { cookies } from "next/headers";
import Link from "next/link";

async function getProgress(username: string, date: string): Promise<Progress> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/progress/user/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function progressDeletePage({
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
              <h1 className="mb-3 text-xl font-bold">Delete Progress Log</h1>
              <Link
                href={`/users/${username}/progress/${date}`}
                className="mb-3 font-bold"
              >
                {formatShortDateStr(progress.date)}
              </Link>
            </div>

            <p className="mb-3">
              Are you sure you wish to delete this progress log?
            </p>
            <p className="my-6 font-bold">
              {formatShortDateStr(progress.date)}
            </p>
            <p className="mb-6">This action cannot be undone.</p>

            <DeleteForm
              url={`progress/${progress.id}`}
              redirect={`/users/${username}`}
              revalidate={`/users/[username]/progress/[date]`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
