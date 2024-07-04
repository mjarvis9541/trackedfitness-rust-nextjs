import DateRouter from "@/components/DateRouter";
import { API } from "@/lib/constants";
import { formatISO, isMatch, isValid } from "date-fns";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import DietDayWrapper from "./DietDayWrapper";

async function getMealOfDayList(): Promise<MealOfDayAPIResponse> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/meal-of-day`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getDietList(username: string, date: string): Promise<Diet[]> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet/user/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function getDietTarget(
  username: string,
  date: string
): Promise<DietTarget> {
  const token = cookies().get("token")?.value;
  const res = await fetch(
    `${API}/diet-targets/user/latest/${username}/${date}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status === 401) redirect("/login");
  return res.json();
}

async function getDietWeekAvg(
  username: string,
  date: string
): Promise<BaseDiet> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet-totals/week-avg/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function DietDayPage({
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

  const dietFetch = getDietList(username, date);
  const mealOfDayFetch = getMealOfDayList();
  const dietTargetLatestFetch = getDietTarget(username, date);
  const dietWeekAvgPr = getDietWeekAvg(username, date);

  const [dietList, mealOfDayList, dietTargetLatest, dietWeekAvg] =
    await Promise.all([
      dietFetch,
      mealOfDayFetch,
      dietTargetLatestFetch,
      dietWeekAvgPr,
    ]);

  return (
    <>
      <DateRouter path={`/users/${username}/diet`} date={date} modifier="day" />

      <main className="p-4">
        <div className="mb-4 rounded border bg-white p-4">
          <h1 className="mb-2 text-xl font-bold">Diet Log</h1>
          <DietDayWrapper
            date={date}
            dietList={dietList}
            dietTarget={dietTargetLatest}
            dietWeekAvg={dietWeekAvg}
            mealOfDayList={mealOfDayList}
            username={username}
          />
        </div>
      </main>
    </>
  );
}
