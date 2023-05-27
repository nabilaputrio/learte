import Link from "next/link";

import { cn } from "@/lib/utils";
import React from "react";
import { useRouter } from "next/router";

const links = [
  {
    path: "/dashboard",
    label: "Overview",
  },
  {
    path: "/dashboard/products",
    label: "Products",
  },
];

export function MainNav({ className, ...props }) {
  const router = useRouter();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => {
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`text-sm font-medium transitioncolors hover:text-primary ${
              router.pathname !== item.path && "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
