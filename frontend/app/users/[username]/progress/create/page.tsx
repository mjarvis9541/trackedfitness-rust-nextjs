import { createProgress } from "@/app/actions";
import ProgressForm from "@/app/users/[username]/progress/ProgressForm";

export default function ProgressCreatePage({
  params: { username },
  searchParams: { date },
}: {
  params: { username: string };
  searchParams: { date?: string };
}) {
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="rounded border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Log Progress</h1>
            <ProgressForm
              username={username}
              date={date}
              action={createProgress}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
