import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import PublicLayout from "../../layout/PublicLayout";
import supabase from "@/lib/supabase";
import { formatRupiah, getResourceDownloadUrl } from "@/lib/utils";
import { CreditCardIcon, DownloadIcon, ShoppingCartIcon } from "lucide-react";

const CartPage = () => {
  const { userId } = useAuth();
  const { data: purchases, isLoading } = useQuery({
    queryKey: [userId, "purchases"],
    queryFn: async () => {
      return await supabase
        .from("purchases")
        .select(
          `*, product (
            name,
            resource
        )`
        )
        .eq("user_id", userId);
    },
    enabled: !!userId,
  });

  return (
    <PublicLayout>
      <h1 className="font-bold text-lg">My Purchases</h1>
      <div className="mt-3">
        {purchases?.data?.length === 0 ? (
          "You have not made any purchase"
        ) : (
          <>
            {purchases?.data?.map((item, idx) => {
              return (
                <div
                  key={item.id}
                  className="mb-2 border rounded p-3 grid grid-cols-4"
                >
                  <div>
                    <span className="mr-4">{idx + 1}</span>
                    <span className="font-semibold">{item.product.name}</span>
                  </div>
                  <div className="flex justify-end">
                    {formatRupiah(item.total)}
                  </div>
                  <div className="flex justify-center">
                    {item.status === "PAID" ? (
                      <div className="text-xs py-1 px-2 rounded-full bg-green-600 text-white flex flex-grow-0">
                        Success
                      </div>
                    ) : new Date().getTime() >
                      new Date(item.created_at).getTime() + 86400000 ? (
                      <div className="text-xs py-1 px-2 rounded-full bg-red-500 text-white flex flex-grow-0">
                        Expired
                      </div>
                    ) : (
                      <div className="text-xs py-1 px-2 rounded-full bg-yellow-400 text-yellow-900 flex flex-grow-0">
                        Pending
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    {item.status === "PAID" ? (
                      <div
                        role="button"
                        className="text-xs shadow py-1 px-3 rounded-full bg-gray-200 text-gray-800 flex flex-grow-0 items-center gap-2"
                        onClick={() => {
                          window.open(
                            getResourceDownloadUrl(item.product.resource),
                            "_blank"
                          );
                        }}
                      >
                        <DownloadIcon size={16} />
                        <span>Download File</span>
                      </div>
                    ) : new Date().getTime() >
                      new Date(item.created_at).getTime() + 86400000 ? (
                      <div className="text-xs shadow py-1 px-3 rounded-full bg-gray-200 text-gray-800 flex flex-grow-0 items-center gap-2">
                        <ShoppingCartIcon size={16} />
                        <span>Repurchase Product</span>
                      </div>
                    ) : (
                      <div
                        role="button"
                        className="text-xs shadow py-1 px-3 rounded-full bg-gray-200 text-gray-800 flex flex-grow-0 items-center gap-2"
                        onClick={() => {
                          window.open(
                            "https://checkout-staging.xendit.co/v2/" +
                              item.invoice_id,
                            "_blank"
                          );
                        }}
                      >
                        <CreditCardIcon size={16} />
                        <span>Complete Payment</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default CartPage;
