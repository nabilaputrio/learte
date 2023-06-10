import PublicLayout from "@/layout/PublicLayout";
import { categories } from "@/pages/dashboard/products";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useQuery } from "react-query";
import supabase from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getThumbnailUrl } from "@/lib/utils";
import { formatRupiah } from "@/lib/utils";
import { Star, StarHalf, StarIcon } from "lucide-react";
import { useRouter } from "next/router";

const Products = () => {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  const changeCategoryFilter = (key) => {
    setActiveTab(key);
  };

  const { data: products, isLoading: loadingProduct } = useQuery({
    queryKey: ["products", activeTab],
    queryFn: async () => {
      if (activeTab === "all") return supabase.from("product").select("*");
      else
        return supabase.from("product").select("*").eq("category", activeTab);
    },
  });

  return (
    <PublicLayout>
      <div>
        <h1 className="text-2xl font-bold">Discover</h1>
        <div className="flex items-center gap-2 mt-4">
          <Badge
            onClick={() => {
              changeCategoryFilter("all");
            }}
            variant={activeTab === "all" ? "default" : "outline"}
            className="p-2 px-4"
          >
            All
          </Badge>
          {categories.map((item) => {
            return (
              <Badge
                key={item.value}
                onClick={() => {
                  changeCategoryFilter(item.value);
                }}
                variant={activeTab === item.value ? "default" : "outline"}
                className="p-2 px-4"
              >
                {item.label}
              </Badge>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-5 gap-3">
          {products?.data?.map((item) => {
            return (
              <Card
                key={item.id}
                className="flex flex-col"
                onClick={() => {
                  router.push(`/products/${item.id}`);
                }}
              >
                <div className="overflow-hidden">
                  <img
                    className="w-full h-[250px] object-cover"
                    src={getThumbnailUrl(item.thumbnail)}
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h1 className="font-bold text-md">{item.name}</h1>
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <StarIcon
                        className="text-[#FAB005]"
                        fill="#FAB005"
                        size={12}
                      />
                      <span className="text-xs text-gray-500">
                        213 - 1,288 Buyers
                      </span>
                    </div>
                    <div className="text-left mt-2">
                      {formatRupiah(item.price)}
                    </div>
                  </div>
                </div>
                {/* <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>
                    Deploy your new project in one-click.
                  </CardDescription>
                </CardHeader> */}
              </Card>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Products;
