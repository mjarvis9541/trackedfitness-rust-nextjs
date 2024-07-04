import { API } from "@/lib/constants";
import { cookies } from "next/headers";

async function getProfile(username: string): Promise<Profile> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/profiles/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function UserProfileDetailPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const token = cookies().get("token")?.value || "";
  const profile = await getProfile(username);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
        </div>
      </div>
    </main>
  );
}
