import PublicLayout from "@/layout/PublicLayout";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import supabase from "@/lib/supabase";

import {
  formatRupiah,
  getResourceDownloadUrl,
  getThumbnailUrl,
} from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ChevronRight,
  DownloadCloud,
  DownloadCloudIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";

const ProductDetail = () => {
  const router = useRouter();
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

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
  const client = useQueryClient();

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
              avatar: user.imageUrl,
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

  const { mutate: submitReview, isLoading: submittingReview } = useMutation({
    mutationFn: async (payload) => {
      return await supabase.from("reviews").insert([payload]).select("*");
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["product", query?.productId, "reviews"],
      });
    },
  });

  const handleDownloadProduct = () => {
    window.open(getResourceDownloadUrl(product.resource), "_blank");
  };

  const { data: purchase } = useQuery({
    queryKey: ["product", query?.productId, "purchase", userId],
    queryFn: async () => {
      return supabase
        .from("purchases")
        .select("*")
        .eq("product_id", query?.productId)
        .eq("user_id", userId)
        .eq("status", "PAID");
    },
    enabled: Boolean(!!query?.productId && userId),
  });

  const purchased = purchase && purchase?.data?.length > 0;
  const ownProduct = data?.data?.[0]?.user_id === userId;

  const { data: reviews } = useQuery({
    queryKey: ["product", query?.productId, "reviews"],
    queryFn: async () => {
      return supabase
        .from("reviews")
        .select("*")
        .eq("product_id", query?.productId);
    },
  });

  const totalRating =
    reviews?.data?.length > 0
      ? reviews.data.reduce((acc, cur) => acc + cur.rating, 0) /
        reviews.data.length
      : 0;
  const userHasReviewed =
    reviews &&
    reviews.data.length > 0 &&
    reviews.data.filter((item) => item.user_id === userId).length > 0;

  const handleClickBuy = () => {
    if (!userId) {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://learte-kappa.vercel.app";
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
          <div className="max-w-[1300px] mx-auto">
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
                {!ownProduct && (
                  <div>
                    <div className="text-xl font-semibold pt-2 flex items-center gap-3">
                      {purchased ? (
                        <Button
                          className="flex items-center gap-2 w-full"
                          onClick={handleDownloadProduct}
                        >
                          <DownloadCloudIcon />
                          <span>Download</span>
                        </Button>
                      ) : (
                        <Button
                          //   variant="outline"
                          className="flex items-center gap-2 w-full"
                          onClick={handleClickBuy}
                          disabled={creatingInvoice}
                        >
                          {creatingInvoice ? "Loading.." : "Buy Now"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <h1 className="font-semibold text-xl">Reviews</h1>
              <div className="mt-6 grid grid-cols-4 gap-5">
                <div className="rounded-lg flex flex-col justify-start items-center">
                  <div className="bg-gray-50 rounded-lg w-full py-20 flex items-center justify-center">
                    <div className="flex items-center">
                      <StarIcon size={40} color="transparent" fill="orange" />
                      <div className="flex items-end leading-none ml-2">
                        <div className="text-[80px]">{totalRating}</div>
                        <div className="text-lg pb-1"> / 5</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  {purchased && !userHasReviewed && (
                    <div className="mb-4 pb-4 border-b">
                      <div>
                        <h3 className="font-medium">Add your review</h3>
                        <div className="flex items-center gap-1 mt-3">
                          {new Array(5).fill(null).map((_, idx) => (
                            <StarIcon
                              size={28}
                              key={idx + 1}
                              color="transparent"
                              fill={
                                selectedRating >= idx + 1 ? "orange" : "gray"
                              }
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedRating(idx + 1);
                              }}
                            />
                          ))}
                        </div>
                        <div>
                          <textarea
                            rows={5}
                            className="w-full border mt-3 border-gray-400 p-2 rounded"
                            placeholder="Write your review here"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                          />
                        </div>
                        <Button
                          className="flex items-center mt-2 w-full"
                          type="button"
                          onClick={() => {
                            if (!reviewText) alert("Please write review");
                            else {
                              const payload = {
                                rating: selectedRating,
                                content: reviewText,
                                product_id: query?.productId,
                                user_name: user.fullName,
                                user_avatar: user.imageUrl,
                                user_id: user.id,
                              };
                              submitReview(payload);
                            }
                          }}
                        >
                          {submittingReview ? "Loading..." : "Submit"}
                        </Button>
                      </div>
                    </div>
                  )}
                  {reviews?.data?.length > 0 ? (
                    <>
                      {reviews.data.map((item) => {
                        return (
                          <div
                            className="border border-gray-200 p-3 rounded mb-3"
                            key={item.id}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                {new Array(5).fill(null).map((_, idx) => (
                                  <StarIcon
                                    size={20}
                                    key={idx + 1}
                                    color="transparent"
                                    fill={
                                      item.rating >= idx + 1 ? "orange" : "gray"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <img
                                src={item.user_avatar}
                                className="w-8 h-8 rounded-full bg-gray-500"
                              />
                              <span className="font-medium">
                                {item.user_name}
                              </span>
                            </div>
                            <div className="mt-3">{item.content}</div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    "No Review Yet"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </PublicLayout>
    </div>
  );
};

export default ProductDetail;
