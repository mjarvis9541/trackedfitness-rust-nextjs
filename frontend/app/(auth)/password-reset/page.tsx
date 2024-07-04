import PasswordResetForm from "./PasswordResetForm";

export default function PasswordResetPage() {
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-4 text-xl font-bold">Password Reset</h1>
            <PasswordResetForm />
          </div>
        </div>
      </div>
    </main>
  );
}
