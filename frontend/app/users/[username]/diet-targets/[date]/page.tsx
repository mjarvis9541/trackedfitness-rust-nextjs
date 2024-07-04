import AdminDetail from "@/components/AdminDetail";
import { API } from "@/lib/constants";
import { formatShortDateStr } from "@/lib/format-date";
import { isMatch, isValid } from "date-fns";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import DietTargetDetail from "../DietTargetDetail";

async function getDietTarget(
  username: string,
  date: string
): Promise<DietTarget> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet-targets/user/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export default async function UserDietTargetDetailPage({
  params: { username, date },
}: {
  params: { username: string; date: string };
}) {
  if (!isValid(new Date(date)) || !isMatch(date, "yyyy-MM-dd")) notFound();

  const dietTarget = await getDietTarget(username, date);
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <div className="flex justify-between">
              <h1 className="mb-3 text-xl font-bold">Diet Target</h1>
              <div className="mb-3 font-bold">
                {formatShortDateStr(dietTarget.date)}
              </div>
            </div>

            <DietTargetDetail dietTarget={dietTarget} />

            <p className="mb-2 mt-4">
              <Link
                href={`/users/${username}/diet-targets/${dietTarget.date}/edit`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
            </p>
            <p>
              <Link
                href={`/users/${username}/diet-targets/${dietTarget.date}/delete`}
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
            <AdminDetail data={dietTarget} />
          </div>
        </div>
      </div>
    </main>
  );
}
