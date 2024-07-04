import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-4">
      <div className="border bg-white p-4">
        <h1 className="text-xl font-bold">Not Found</h1>
        <p>Could not find requested resource.</p>
        <p>
          <Link href="/">Home</Link>
        </p>
      </div>
    </main>
  );
}
