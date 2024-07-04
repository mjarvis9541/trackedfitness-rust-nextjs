import { updateProfile } from "@/app/actions";
import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import ProfileForm from "../ProfileForm";

async function getProfile(username: string): Promise<Profile> {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/profiles/latest-weight/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export default async function ProfileUpdatePage({
  params: { username },
}: {
  params: { username: string };
}) {
  const profile = await getProfile(username);

  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>
            <p className="mb-4">
              Update your fitness profile. This gives you information such as
              your current Body Mass Index (BMI), Basal Metabolic Rate (BMR) and
              total daily energy expenditure.
            </p>
            <ProfileForm
              action={updateProfile}
              profile={profile}
              username={username}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
