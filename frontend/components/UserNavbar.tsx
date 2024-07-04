import titleCase from "@/lib/title-case";
import Link from "next/link";

export default function UserNavbar({ username }: { username: string }) {
  return (
    <nav className="flex items-center justify-between bg-zinc-700 text-zinc-100">
      <div className="flex items-center">
        <Link
          href={`/users/${username}`}
          className="px-3 py-2 text-base font-bold hover:bg-amber-300"
        >
          {titleCase(username)}
        </Link>
        <Link
          href={`/users/${username}/diet`}
          className="px-3 py-2 hover:bg-amber-300"
        >
          Diet Log
        </Link>
        <Link
          href={`/users/${username}/diet-total-month`}
          className="px-3 py-2 hover:bg-amber-300"
        >
          Diet Total
        </Link>
        <Link
          href={`/users/${username}/diet-target-month`}
          className="px-3 py-2 hover:bg-amber-300"
        >
          Diet Target
        </Link>
        <Link
          href={`/users/${username}/progress-month`}
          className="px-3 py-2 hover:bg-amber-300"
        >
          Progress
        </Link>
        <Link
          href={`/users/${username}/diet-week`}
          className="px-3 py-2 hover:bg-amber-300"
        >
          Week Summary
        </Link>
        <Link
          href={`/users/${username}/meals`}
          className="px-3 py-2 hover:bg-amber-300"
        >
          Saved Meals
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href={`/logout`} className="px-3 py-2 hover:bg-amber-300">
          Log out
        </Link>
      </div>
    </nav>
  );
}
