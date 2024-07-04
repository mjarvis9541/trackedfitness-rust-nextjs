import DateRouter from "@/components/DateRouter";
import { API } from "@/lib/constants";
import { formatISO } from "date-fns";
import { cookies } from "next/headers";
import ProgressMonthList from "../progress/ProgressMonthList";

async function getProgressList(
  username: string,
  date: string
): Promise<ProgressListResponse> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/progress/user/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function UserProgressListPage({
  params: {
    username,
    date = formatISO(new Date(), { representation: "date" }),
  },
}: {
  params: { username: string; date: string };
}) {
  const progressList = await getProgressList(username, date);

  return (
    <>
      <DateRouter
        path={`/users/${username}/progress-month`}
        date={date}
        modifier="month"
      />
      <main className="p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <div className="rounded border bg-white p-4">
              <h1 className="mb-2 text-xl font-bold">Progress Log</h1>
              <ProgressMonthList
                progressList={progressList}
                username={username}
                date={date}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
