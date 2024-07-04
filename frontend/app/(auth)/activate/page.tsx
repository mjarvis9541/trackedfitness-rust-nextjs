import ActivateForm from "./ActivateForm";

export default async function Page() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-3 text-xl font-bold">Activate Account</h1>

            <p className="mb-3">Input email activation token to proceed.</p>

            <ActivateForm />
          </div>
        </div>
      </div>
    </div>
  );
}
