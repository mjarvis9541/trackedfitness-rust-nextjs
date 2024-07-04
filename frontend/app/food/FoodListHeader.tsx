"use client";

export default function FoodListHeader({
  title,
  subtitle,
  //   headers,
  handleCheckAll,
  isAllChecked,
}: {
  title: string;
  subtitle: string;
  handleCheckAll: any;
  isAllChecked: any;
  //   headers: Array<string>;
}) {
  const headers = [
    "Quantity",
    "Calories",
    "Protein",
    "Carbs",
    "Fat",
    "Sat. Fat",
    "Sugars",
    "Fibre",
    "Salt",
    "",
    "",
    "",
  ];
  return (
    <>
      <div className="grid place-content-center border-b-[1px] p-2">
        <input
          type="checkbox"
          onChange={handleCheckAll}
          checked={isAllChecked}
        />
      </div>
      <div className="col-span-2 border-b-[1px] p-2 font-bold text-gray-900">
        {title}
      </div>
      <div className="border-b-[1px] p-2 font-bold text-gray-900">
        {subtitle}
      </div>
      {headers.map((header, i) => (
        <div
          className="border-b-[1px] p-2 text-end font-bold text-gray-900"
          key={i}
        >
          {header}
        </div>
      ))}
    </>
  );
}
