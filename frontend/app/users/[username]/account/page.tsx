import Link from "next/link";

export default function AccountPage({
  params: { username },
}: {
  params: { username: string };
}) {
  return (
    <main className="p-4">
      <div className="grid grid-cols-12">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Account</h1>
            <Link
              href={`/users/${username}/account/edit`}
              className="text-blue-500"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
