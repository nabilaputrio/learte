import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { formatRupiah } from "@/lib/utils";

export function AdminRecentSales({ recentSalesData }) {
  return (
    <div className="space-y-8">
      {recentSalesData?.data?.slice(0, 5)?.map((item) => {
        return (
          <div className="flex items-center justify-between" key={item.id}>
            <div className="flex items-center gap-1">
              <Avatar className="h-9 w-9">
                <AvatarImage src={item.avatar} alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {item.name ?? "Anonymous"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.email ?? "Anonymous email"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="ml-auto font-medium">
                +{formatRupiah(item.total)}
              </div>
              <div className="flex justify-center">
                {item.status === "PAID" ? (
                  <div className="text-[8px] py-1 px-2 rounded-full bg-green-600 text-white flex flex-grow-0">
                    Success
                  </div>
                ) : new Date().getTime() >
                  new Date(item.created_at).getTime() + 86400000 ? (
                  <div className="text-[8px] py-1 px-2 rounded-full bg-red-500 text-white flex flex-grow-0">
                    Expired
                  </div>
                ) : (
                  <div className="text-[8px] py-1 px-2 rounded-full bg-yellow-400 text-yellow-900 flex flex-grow-0">
                    Pending
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
