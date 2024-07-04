import DeleteForm from "@/components/DeleteForm";

export default async function UserProfileDeletePage({
  params: { username },
}: {
  params: { username: string };
}) {
  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold capitalize">
              Delete Profile
            </h1>
            <p className="mb-3">
              Are you sure you wish to delete this profile?
            </p>
            <p className="mb-6">This action cannot be undone.</p>

            <DeleteForm
              url={`profiles/${username}`}
              redirect={`/users/${username}`}
              revalidate={`/users/[username]`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
