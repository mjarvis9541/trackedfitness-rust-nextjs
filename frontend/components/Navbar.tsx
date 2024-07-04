import parseJwt from "@/lib/parse-jwt";
import { cookies } from "next/headers";
import Link from "next/link";

const navLinks = [
  { href: "/food", name: "Food" },
  { href: "/food", name: "Food" },
  { href: "/food", name: "Food" },
  {
    href: "/brands",
    name: "Brands",
  },
  {
    href: "/meal-of-day",
    name: "Meals",
  },
  {
    href: "/users",
    name: "Users",
  },
];

export default function Navigation() {
  // console.log("navbar");
  const username = cookies().get("username")?.value;
  const token = cookies().get("token")?.value;
  let exp;
  if (token && token !== "fast") {
    // console.log("navbar checking token");
    let parts = parseJwt(token);
    let isExpired = Date.now() > parts.exp * 1000;
    exp = isExpired;
  }
  // console.log("Render - Navbar", token?.value);

  return (
    <nav className="flex items-center justify-between bg-zinc-800 text-zinc-100">
      <Link
        href="/"
        className="px-3 py-2 font-bold hover:cursor-pointer hover:bg-amber-300"
      >
        Trackedfitness
      </Link>

      <div className="flex">
        {username && !exp ? (
          <>
            <Link
              href={`/users/${username}`}
              className="px-3 py-2 capitalize hover:cursor-pointer hover:bg-amber-300"
            >
              {username}
            </Link>
            <Link
              href={`/users/${username}/diet`}
              className="px-3 py-2 capitalize hover:cursor-pointer hover:bg-amber-300"
            >
              Diet
            </Link>
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className="px-3 py-2 hover:bg-amber-300"
              >
                {link.name}
              </Link>
            ))}
          </>
        ) : (
          <>
            <Link href="/login" className="px-3 py-2 hover:bg-amber-300">
              Log in
            </Link>
            <Link href="/signup" className="px-3 py-2 hover:bg-amber-300">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
