import LogoutForm from "./LogoutForm";

export default function LogoutPage() {
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-4 text-xl font-bold">Log out</h1>

            <p className="mb-4">Are you sure you wish to log out?</p>

            <LogoutForm />
          </div>
        </div>
      </div>
    </main>
  );
}
