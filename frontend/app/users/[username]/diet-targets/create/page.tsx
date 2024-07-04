import { createDietTarget } from "@/app/actions";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DietTargetForm from "../DietTargetForm";

async function getLatestWeight(username: string) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/progress/latest-weight/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) redirect("/login");
  }
  return res.json();
}

export default async function DietTargetCreatePage({
  params: { username },
  searchParams: { date },
}: {
  params: { username: string };
  searchParams: { date: string };
}) {
  const weight = await getLatestWeight(username);
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Create Diet Target</h1>

            <DietTargetForm
              date={date}
              latestWeight={weight}
              username={username}
              action={createDietTarget}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
