"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    href: "/food",
    name: "Food",
  },
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
  const pathname = usePathname();

  return (
    <nav className="flex items-center">
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);

        return (
          <Link
            className={`px-3 py-1.5 ${isActive ? "bg-amber-300" : ""}`}
            href={link.href}
            key={link.name}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
