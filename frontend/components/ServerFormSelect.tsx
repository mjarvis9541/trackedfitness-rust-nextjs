import ServerFormError from "./ServerFormError";

type SelectOption = {
  label: string;
  value: any;
};

export default function ServerFormSelect({
  error,
  label,
  name,
  options,
  defaultValue,
}: {
  error: any;
  label?: string;
  name: string;
  options: SelectOption[];
  defaultValue?: any;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-bold">
        {label || <span className="capitalize">{name}</span>}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="block h-[42px] w-full rounded border bg-transparent px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 active:border-blue-500 active:ring-2 active:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="mt-1 text-sm">
          <ServerFormError error={error} field={name} />
        </div>
      )}
    </label>
  );
}
