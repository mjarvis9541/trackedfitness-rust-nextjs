import { API } from "@/lib/constants";
import { formatISO } from "date-fns";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import UserDetail from "../UserDetail";
import TargetDetail from "./diet-targets/TargetDetail";
import ProfileDetail from "./profile/ProfileDetail";

async function getUser(username: string): Promise<User> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/users/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) redirect("/login");
    if (res.status === 404) notFound();
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

async function getProfile(username: string) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/profiles/latest-weight/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) redirect("/login");
    if (res.status === 404) return null;
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

async function getTarget(username: string, date: string) {
  const token = cookies().get("token")?.value;
  const res = await fetch(
    `${API}/diet-targets/user/latest/${username}/${date}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    if (res.status === 401) redirect("/login");
    if (res.status === 404) return null;
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export default async function UserDetailPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const date = formatISO(new Date(), { representation: "date" });
  const userData = getUser(username);
  const profileData = getProfile(username);
  const targetData = getTarget(username, date);

  return (
    <main className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-4">
        <div className="border bg-white p-4">
          <h2 className="mb-3 text-xl font-bold capitalize">{username}</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <UserDetail promise={userData} username={username} />
          </Suspense>
        </div>
      </div>
      <div className="col-span-4">
        <div className="border bg-white p-4">
          <h2 className="mb-3 text-xl font-bold">Profile</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileDetail promise={profileData} username={username} />
          </Suspense>
        </div>
      </div>
      <div className="col-span-4">
        <div className="border bg-white p-4">
          <h2 className="mb-3 text-xl font-bold">Diet Target</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <TargetDetail promise={targetData} username={username} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
