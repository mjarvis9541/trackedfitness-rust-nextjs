"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="p-4">
      <div className="border bg-white p-4">
        <h1 className="mb-6 text-xl font-bold">Error</h1>
        <pre className="mb-6">{JSON.stringify(error.message, null, 2)}</pre>
        <button
          className="rounded border bg-gray-100 px-3 py-2"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
