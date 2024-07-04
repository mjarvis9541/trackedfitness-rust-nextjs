import { updateProgress } from "@/app/actions";
import { API } from "@/lib/constants";
import { formatShortDateStr } from "@/lib/format-date";
import { cookies } from "next/headers";
import Link from "next/link";
import ProgressForm from "../../ProgressForm";

async function getProgress(username: string, date: string): Promise<Progress> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/progress/user/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function ProgressUpdatePage({
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
              <h1 className="mb-3 text-xl font-bold capitalize">
                Edit Progress Log
              </h1>
              <Link
                href={`/users/${username}/progress/${date}`}
                className="mb-3 font-bold"
              >
                {formatShortDateStr(progress.date)}
              </Link>
            </div>
            <ProgressForm
              action={updateProgress}
              initial={progress}
              username={username}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
