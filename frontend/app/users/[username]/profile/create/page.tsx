import { createProfile } from "@/app/actions";
import titleCase from "@/lib/title-case";
import Link from "next/link";
import ProfileForm from "../ProfileForm";

export default function UserProfileCreatePage({
  params: { username },
}: {
  params: { username: string };
}) {
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-1 text-xl font-bold">Create Profile</h1>
            <Link
              href={`/users/${username}`}
              className="mb-3 inline-block font-bold capitalize"
            >
              {titleCase(username)}
            </Link>

            <ProfileForm action={createProfile} username={username} />
          </div>
        </div>
      </div>
    </main>
  );
}
