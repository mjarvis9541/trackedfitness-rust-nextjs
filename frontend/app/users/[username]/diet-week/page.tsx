import DateRouter from "@/components/DateRouter";
import { API } from "@/lib/constants";
import { formatISO, isMatch, isValid } from "date-fns";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import DietList from "./DietList";
import DietListFooter from "./DietListFooter";
import DietListHeader from "./DietListHeader";

async function getDietDayTotal(
  username: string,
  date: string
): Promise<BaseDiet> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet-totals/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
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

async function getDietWeekTotal(
  username: string,
  date: string
): Promise<BaseDiet> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet-totals/week-total/${username}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

const headers = [
  "Calories",
  "Protein",
  "Carbs",
  "Fat",
  "Sat. Fat",
  "Sugars",
  "Fibre",
  "Salt",
  "Cals/kg",
  "Pro/kg",
  "Carbs/kg",
  "Fat/kg",
  "Weight",
];

export default async function DietWeekSummary({
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
  const dayTotal = getDietDayTotal(username, date);
  const weekAvg = getDietWeekAvg(username, date);
  const weekTotal = getDietWeekTotal(username, date);

  return (
    <>
      <DateRouter
        path={`/users/${username}/diet-week`}
        date={date}
        modifier="week"
      />
      <main className="p-4">
        <div className="mb-4 rounded border bg-white p-4">
          <h1 className="mb-2 text-xl font-bold">Diet Week Summary</h1>
          <div className="grid grid-cols-[auto_repeat(15,_minmax(0,_1fr))]">
            <DietListHeader title={"Date"} subtitle={"Day"} headers={headers} />
            <Suspense
              fallback={<div className="col-span-full p-2">Loading...</div>}
            >
              {/* @ts-ignore */}
              <DietList username={username} date={date} promise={dayTotal} />
            </Suspense>
            <Suspense
              fallback={
                <div className="col-span-full bg-gray-100 p-2">Loading...</div>
              }
            >
              <DietListFooter title={"Total"} promise={weekTotal} />
            </Suspense>
            <Suspense
              fallback={
                <div className="col-span-full bg-gray-100 p-2">Loading...</div>
              }
            >
              <DietListFooter title={"Average"} promise={weekAvg} />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
