"use client";

import DeleteIdRangeFormFormN from "@/components/DeleteIdRangeFormN";
import useCheckIds from "@/hooks/useCheckIds";
import UserListItem from "./UserListItem";

export default function UserList({ userList }: { userList: UserListResult }) {
  const { handleCheck, handleCheckAll, reset, checkList, allChecked } =
    useCheckIds({ dataList: userList.results });

  return (
    <>
      <div className="grid grid-cols-[auto_repeat(4,_minmax(0,_1fr))_auto_auto_auto]">
        <div className="border-b-[1px] p-2 font-bold">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={allChecked}
          />
        </div>
        <div className="border-b-[1px] p-2 font-bold">Username</div>
        <div className="border-b-[1px] p-2 font-bold">Name</div>
        <div className="border-b-[1px] p-2 font-bold">Email</div>
        <div className="border-b-[1px] p-2 font-bold">Active</div>
        <div className="border-b-[1px] p-2 font-bold">Last Login</div>
        <div className="border-b-[1px] p-2 font-bold">Created at</div>
        <div className="border-b-[1px] p-2 font-bold">Updated At</div>
        {userList.results.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            checked={checkList.includes(user.id)}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <div className="mt-4">
        <DeleteIdRangeFormFormN
          handleUncheckAll={reset}
          idRange={checkList}
          revalidate={`/users/[username]`}
          url={`users/delete-id-range`}
          username={``}
        />
      </div>
    </>
  );
}
