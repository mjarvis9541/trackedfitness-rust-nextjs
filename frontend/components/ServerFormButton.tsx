export default function ServerFormButton({
  label = "Submit",
  labelLoading = "Loading...",
  loading,
  disabled,
  style,
}: {
  label?: string;
  labelLoading?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: string;
}) {
  let twClass = `border rounded bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200`;
  if (style === "delete") {
    twClass = `rounded bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700 text-white disabled:opacity-50 disabled:hover:bg-red-600`;
  }
  return (
    <button disabled={disabled || loading} className={twClass}>
      {loading ? labelLoading : label}
    </button>
  );
}
