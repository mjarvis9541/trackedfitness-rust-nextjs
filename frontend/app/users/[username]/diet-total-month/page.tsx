import DateRouter from "@/components/DateRouter";
import { API } from "@/lib/constants";
import { formatISO, isMatch, isValid } from "date-fns";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import DietTotalMonthList from "../diet-totals/DietTotalMonthList";

async function getDietTotalList(
  username: string,
  date: string
): Promise<DietDayTotal[]> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet-totals/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function DietTotalMonthPage({
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
  const dietTotalList = await getDietTotalList(username, date);

  return (
    <>
      <DateRouter
        path={`/users/${username}/diet-total-month`}
        date={date}
        modifier="month"
      />
      <main className="p-4">
        <div className="rounded border bg-white p-4">
          <h1 className="mb-2 text-xl font-bold">Diet Total</h1>
          <DietTotalMonthList
            date={date}
            dietTotalList={dietTotalList}
            username={username}
          />
        </div>
      </main>
    </>
  );
}
