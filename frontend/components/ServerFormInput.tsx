import ServerFormError from "./ServerFormError";

export default function ServerFormInput({
  defaultValue,
  error,
  label,
  name,
  step,
  type = "text",
}: {
  defaultValue?: string | number;
  error?: any;
  label?: string;
  name: string;
  step?: number;
  type?: string;
}) {
  return (
    <>
      <label className="mb-4 block">
        <span className="mb-1 block text-sm font-bold">
          {label || <span className="capitalize">{name}</span>}
        </span>
        <input
          name={name}
          step={step}
          type={type}
          defaultValue={defaultValue}
          className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 active:border-blue-500 active:ring-2 active:ring-blue-500"
        />
        {error && (
          <div className="mt-1 text-sm">
            <ServerFormError error={error} field={name} />
          </div>
        )}
      </label>
    </>
  );
}
