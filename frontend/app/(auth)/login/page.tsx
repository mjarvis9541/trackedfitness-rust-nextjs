import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="p-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-4 text-xl font-bold">Log in</h1>

            <LoginForm />

            <p className="mt-6">
              <Link
                href="/password-reset"
                className="text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </p>
            <p className="my-2">
              Need an account?{" "}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
