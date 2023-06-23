import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import { PublicNav } from "@/components/public-nav";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

const PublicLayout = ({ children }) => {
  const { isSignedIn } = useUser();
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="font-bold text-xl">
            LeArté
          </Link>
          <PublicNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            {/* <Search /> */}
            {isSignedIn ? (
              <>
                <Link
                  href="/cart"
                  className="hover:bg-gray-200 p-2 rounded-full cursor-pointer"
                >
                  <ShoppingCartIcon size={20} />
                </Link>
                <UserNav />
              </>
            ) : (
              <Link href="/sign-in" className="text-xs">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </div>
  );
};

export default PublicLayout;
