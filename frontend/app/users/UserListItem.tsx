import { formatShortDateTime } from "@/lib/format-date";
import Link from "next/link";
import { ChangeEventHandler } from "react";

export default function UserListItem({
  handleCheck,
  checked,
  user,
}: {
  handleCheck: ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
  user: User;
}) {
  return (
    <div className="group contents">
      <div className="p-2 group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={user.id}
          checked={checked}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/users/${user.username}`}
        className="p-2 capitalize group-hover:bg-amber-200"
      >
        {user.username}
      </Link>
      <Link
        href={`/users/${user.username}`}
        className="p-2 capitalize group-hover:bg-amber-200"
      >
        {user.name}
      </Link>
      <div className="p-2 group-hover:bg-amber-200">{user.email}</div>
      <div className="p-2 group-hover:bg-amber-200">
        {JSON.stringify(user.is_active, null, 2)}
      </div>
      <div className="p-2 group-hover:bg-amber-200">
        {user.last_login ? formatShortDateTime(user.last_login) : "-"}
      </div>
      <div className="p-2 group-hover:bg-amber-200">
        {formatShortDateTime(user.created_at)}
      </div>
      <div className="p-2 group-hover:bg-amber-200">
        {user.updated_at ? formatShortDateTime(user.updated_at) : "-"}
      </div>
    </div>
  );
}
