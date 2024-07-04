import Link from "next/link";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4  md:grid-cols-12">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-4 text-xl font-bold">Sign up</h1>

            <SignupForm />

            <p className="mb-2 mt-6">
              Already have an account?
              <Link
                href="/login"
                className="ml-2 text-blue-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
