import Link from "next/link";
import LoginForm from "./(auth)/login/LoginForm";

export default function Home() {
  return (
    <main className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border bg-white p-4">
            <h1 className="mb-4 text-xl font-bold">Log in</h1>

            <LoginForm />

            <p className="mb-2 mt-6">
              <Link
                href="/password-reset"
                className="text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </p>
            <p className="mb-2">
              Need an account?
              <Link
                href="/signup"
                className="ml-2 text-blue-500 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
