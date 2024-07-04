import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import UserForm from "../../../UserForm";

async function getUser(username: string): Promise<User> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/users/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function UserUpdatePage({
  params: { username },
}: {
  params: { username: string };
}) {
  const user = await getUser(username);
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-4 text-xl font-bold capitalize">
              {user.username}
            </h1>
            <UserForm user={user} />
          </div>
        </div>
      </div>
    </main>
  );
}
