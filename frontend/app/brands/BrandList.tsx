"use client";

import DeleteIdRangeFormFormN from "@/components/DeleteIdRangeFormN";
import useCheckIds from "@/hooks/useCheckIds";
import BrandListItem from "./BrandListItem";

export default function BrandList({
  brandList,
}: {
  brandList: BrandListResult;
}) {
  const { handleCheck, handleCheckAll, reset, checkList, allChecked } =
    useCheckIds({ dataList: brandList.results });

  return (
    <>
      <div className="grid grid-cols-[auto_repeat(4,_minmax(0,_1fr))_auto_auto]">
        <div className="border-b-[1px] p-2 font-bold">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={allChecked}
          />
        </div>
        <div className="border-b-[1px] p-2 font-bold">Name</div>
        <div className="border-b-[1px] p-2 font-bold">Slug</div>
        <div className="border-b-[1px] p-2 font-bold">Food</div>
        <div className="border-b-[1px] p-2 font-bold">Created By</div>
        <div className="border-b-[1px] p-2 font-bold">Created At</div>
        <div className="border-b-[1px] p-2 font-bold">Updated At</div>
        {brandList.results.map((brand) => (
          <BrandListItem
            key={brand.id}
            brand={brand}
            isChecked={checkList}
            handleCheck={handleCheck}
          />
        ))}
      </div>
      <div className="mt-4">
        <DeleteIdRangeFormFormN
          handleUncheckAll={reset}
          idRange={checkList}
          revalidate={`/brands/[slug]`}
          url={`brands/delete-id-range`}
          username={``}
        />
      </div>
    </>
  );
}
