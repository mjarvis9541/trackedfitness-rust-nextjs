import { updateDietTarget } from "@/app/actions";
import { API } from "@/lib/constants";
import { formatShortDateStr } from "@/lib/format-date";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import DietTargetForm from "../../DietTargetForm";

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

export default async function DietTargetUpdatePage({
  params: { username, date },
}: {
  params: { username: string; date: string };
}) {
  const dietTarget = await getDietTarget(username, date);
  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <div className="flex justify-between">
              <h1 className="mb-3 text-xl font-bold">Edit Diet Target</h1>
              <Link
                href={`/users/${username}/diet-targets/${date}`}
                className="mb-3 font-bold"
              >
                {formatShortDateStr(dietTarget.date)}
              </Link>
            </div>
            <DietTargetForm
              action={updateDietTarget}
              dietTarget={dietTarget}
              username={username}
              date={date}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
