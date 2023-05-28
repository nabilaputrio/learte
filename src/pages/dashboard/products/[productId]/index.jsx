import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layout/DashboardLayout";
import supabase from "@/lib/supahase";
import {
  formatRupiah,
  getResourceDownloadUrl,
  getThumbnailUrl,
} from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { ChevronRight, DownloadCloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

const ProductDetail = () => {
  const router = useRouter();

  const { query } = router;
  const { user } = useUser();

  const { data, isLoading: loadingProductData } = useQuery({
    queryKey: ["product", query],
    queryFn: async () => {
      return supabase.from("product").select("*").eq("id", query.productId);
    },
    enabled: !!query?.productId && !!user,
    onSuccess: (res) => {
      const productData = res?.data?.[0] ?? {};
      if (productData.user_id !== user.id) {
        router.push("/dashboard/products");
        return;
      }
    },
  });

  const product = data?.data?.[0] ?? {};

  return (
    <DashboardLayout>
      {loadingProductData ? (
        <>Loading..</>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/products">Products</Link>
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
              <div>
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
              </div>
              <div className="mt-2">
                <div className="text-base">{product.description}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ProductDetail;
