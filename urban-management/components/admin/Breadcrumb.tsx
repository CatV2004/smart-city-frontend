"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-gray-500">
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");

        const label =
          segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <span key={href}>
            {index > 0 && <span className="mx-1">/</span>}
            <Link
              href={href}
              className="hover:text-gray-900 dark:hover:text-white"
            >
              {label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}