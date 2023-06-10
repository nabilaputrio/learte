import PublicLayout from "@/layout/PublicLayout";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import supabase from "@/lib/supabase";

import {
  formatRupiah,
  getResourceDownloadUrl,
  getThumbnailUrl,
} from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChevronRight, DownloadCloud } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";

const ProductDetail = () => {
  const router = useRouter();

  const { query } = router;
  const { data, isLoading: loadingProductData } = useQuery({
    queryKey: ["product", query],
    queryFn: async () => {
      return supabase.from("product").select("*").eq("id", query.productId);
    },
    enabled: !!query?.productId,
  });

  const product = data?.data?.[0] ?? {};

  const { userId } = useAuth();
  const { user } = useUser();

  const { mutate: createInvoice, isLoading: creatingInvoice } = useMutation({
    mutationFn: async () => {
      return await axios.post("/api/create-invoice", {
        data: {
          payload: {
            amount: 10000,
            items: [
              {
                name: product.name,
                quantity: 1,
                price: product.price,
                category: product.category,
                url: router.asPath,
              },
            ],
            userId,
            productId: query?.productId,
            description: product.description,
            customer: {
              surname: user.fullName,
              email: user.primaryEmailAddress.emailAddress,
            },
          },
        },
      });
    },
    onSuccess: (resp) => {
      const { data } = resp;
      const { invoiceUrl } = data;
      if (invoiceUrl) {
        window.open(invoiceUrl, "_blank");
      }
    },
  });

  const handleClickBuy = () => {
    if (!userId) {
      const encodedUrl = encodeURIComponent(
        "http://localhost:3000" + router.asPath
      );
      return router.push(`/sign-in?redirect_url=${encodedUrl}`);
    }
    /**
     * HANDLE LOGIC BUY PRODUCT
     */
    createInvoice();
  };

  return (
    <div>
      <PublicLayout>
        {loadingProductData ? (
          <>Loading..</>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Link href="/products">Products</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="font-semibold">{product.name}</span>
            </div>
            <div className="mt-6 grid grid-cols-2 border rounded">
              <div className="p-4 bg-slate-100 flex items-center justify-center">
                <img src={getThumbnailUrl(product.thumbnail)} />
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <div>Product Name</div>
                  <div className="text-xl font-semibold">{product.name}</div>
                </div>
                <div>
                  <div>Price</div>
                  <div className="text-xl font-semibold">
                    {formatRupiah(product.price)}
                  </div>
                </div>
                <div>
                  <div>Category</div>
                  <div className="text-xl font-semibold">
                    <Badge>{product.category}</Badge>
                  </div>
                </div>
                {/* <div>
                  <div>Product File</div>
                  <div className="text-xl font-semibold pt-2 flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        window.open(
                          getResourceDownloadUrl(product.resource),
                          "_blank"
                        );
                      }}
                    >
                      Download <DownloadCloud className="text-gray-400" />
                    </Button>
                  </div>
                </div> */}
                <div className="mt-2">
                  <div className="text-base">{product.description}</div>
                </div>
                <div>
                  <div className="text-xl font-semibold pt-2 flex items-center gap-3">
                    <Button
                      //   variant="outline"
                      className="flex items-center gap-2 w-full"
                      onClick={handleClickBuy}
                      disable={creatingInvoice}
                    >
                      {creatingInvoice ? "Loading.." : "Buy Now"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </PublicLayout>
    </div>
  );
};

export default ProductDetail;
