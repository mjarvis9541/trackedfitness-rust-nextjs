import { API } from "@/lib/constants";
import { formatLongDate } from "@/lib/format-date";
import { formatISO, subDays } from "date-fns";
import { cookies } from "next/headers";
import DietFormCopyFrom from "../../../DietFormCopyFrom";

async function getDietMealList(username: string, date: string, meal: string) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet/user/${username}/${date}/${meal}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  return res.json();
}

export default async function DietCopyFromPage({
  params: { username, date, meal },
}: {
  params: { username: string; date: string; meal: string };
}) {
  const previous = formatISO(subDays(new Date(date), 1), {
    representation: "date",
  });
  const dietMealList = await getDietMealList(username, previous, meal);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 border bg-white p-4">
          <div className="">
            <h1 className="text-xl font-bold">
              Copy From {formatLongDate(previous)} to {formatLongDate(date)}
            </h1>
            <pre className="my-4">{JSON.stringify(dietMealList, null, 2)}</pre>

            <DietFormCopyFrom
              from_date={previous}
              username={username}
              date={date}
              meal={meal}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
