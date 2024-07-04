import DateRouter from "@/components/DateRouter";
import { API } from "@/lib/constants";
import { formatISO, isMatch, isValid } from "date-fns";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import DietTargetMonthList from "../diet-targets/DietTargetMonthList";

async function getDietTargetList(username: string, date: string) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet-targets/user/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function UserDietTargetListPage({
  params: {
    username,
    date = formatISO(new Date(), { representation: "date" }),
  },
}: {
  params: { username: string; date: string };
}) {
  if (!isValid(new Date(date)) || !isMatch(date, "yyyy-MM-dd")) {
    notFound();
  }
  const dietTargetList = await getDietTargetList(username, date);

  return (
    <>
      <DateRouter
        path={`/users/${username}/diet-target-month`}
        date={date}
        modifier="month"
      />
      <main className="p-4">
        <div className="mb-4 rounded border bg-white p-4">
          <h1 className="mb-2 text-xl font-bold">Diet Target</h1>
          <DietTargetMonthList
            date={date}
            dietTargetList={dietTargetList}
            username={username}
          />
        </div>
      </main>
    </>
  );
}
