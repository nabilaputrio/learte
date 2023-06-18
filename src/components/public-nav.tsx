import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const publicLinks = [
  {
    path: "/products",
    label: "Product",
    private: false,
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    private: true,
  },
  {
    path: "/admin/overview",
    label: "Admin Dashboard",
    private: true,
    adminAccess: true,
  },
];

export function PublicNav({ className, ...props }) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { user } = useUser();

  const adminWhitelist = ["user_2RHQlys0DxiYbLaZr65dwE1WjTR"];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {publicLinks
        .filter((item) => {
          if (!isSignedIn) {
            return !item.private;
          } else if (item.adminAccess) {
            return adminWhitelist.includes(user.id);
          }
          return true;
        })
        .map((item) => {
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
