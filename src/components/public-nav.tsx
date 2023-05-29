import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import Link from "next/link";

const publicLinks = [
  {
    path: "/products",
    label: "Product",
  },
];

export function PublicNav({ className, ...props }) {
  const router = useRouter();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {publicLinks.map((item) => {
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
