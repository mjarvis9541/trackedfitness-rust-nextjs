export default function DietListHeader({
  title,
  subtitle,
  headers,
}: {
  title: string;
  subtitle: string;
  headers: Array<string>;
}) {
  return (
    <>
      <div className="grid place-content-center border-b-[1px] p-2">
        <input type="checkbox" name="" id="" />
      </div>
      <div className="border-b-[1px] p-2 font-bold text-gray-900">{title}</div>
      <div className="border-b-[1px] p-2 font-bold text-gray-900">
        {subtitle}
      </div>
      {headers.map((header) => (
        <div
          className="border-b-[1px] p-2 text-end font-bold text-gray-900"
          key={header}
        >
          {header}
        </div>
      ))}
    </>
  );
}
