import { AdminNav } from "@/components/admin-nav";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="font-bold text-xl">
            LeArté
          </Link>
          <AdminNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
