import { Metadata } from "next";
import Image from "next/image";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { MainNav } from "@/components/main-nav";
import { Overview } from "@/components/overview";
import { AdminRecentSales } from "@/components/admin-recent-sales";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { useQuery } from "react-query";
import supabase from "@/lib/supabase";
import { formatRupiah } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

export const metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

function findKeyWithGreatestValue(obj) {
  let greatestValue = Number.NEGATIVE_INFINITY;
  let greatestKey = null;

  for (let [key, value] of Object.entries(obj)) {
    if (value > greatestValue) {
      greatestValue = value;
      greatestKey = key;
    }
  }

  return greatestKey;
}

export default function DashboardPage() {
  const { user } = useUser();
  const { id = null } = user ?? {};

  const { data: productsNumber, isLoading: loadingProductNumber } = useQuery({
    queryKey: ["seller", "productNumber"],
    queryFn: async () => {
      return await supabase.from("product").select("*").eq("user_id", id);
    },
    enabled: Boolean(!!id),
  });

  const { data: customerData, isLoading: loadingCustomerData } = useQuery({
    queryKey: ["seller", "customerCount"],
    queryFn: async () => {
      return await supabase.rpc("count_distinct_users");
    },
  });

  const productIds = productsNumber?.data?.map((item) => {
    return item.id;
  });

  const { data: salesNumber, isLoading: loadingSalesNumber } = useQuery({
    queryKey: ["seller", "salesNumber"],
    queryFn: async () => {
      return await supabase
        .from("purchases")
        .select("*")
        .in("product_id", productIds);
    },
    enabled: Boolean(productIds && productIds?.length > 0),
  });

  const totalRevenue = salesNumber?.data
    ?.filter((item) => {
      return item.status === "PAID";
    })
    .reduce((acc, cur) => acc + cur.total, 0);

  const customerCount = salesNumber?.data
    ?.filter((item) => {
      return !!item.email;
    })
    .reduce((acc, cur) => {
      if (!acc[cur.email]) {
        acc[cur.email] = 1;
      } else {
        acc[cur.email] += 1;
      }
      return acc;
    }, {});

  const productCount = salesNumber?.data?.reduce((acc, cur) => {
    if (!acc[cur.product_id]) {
      acc[cur.product_id] = 1;
    } else {
      acc[cur.product_id] += 1;
    }
    return acc;
  }, {});
  const mostFreqProduct = findKeyWithGreatestValue(productCount ?? {});
  const freqProductData = productsNumber?.data?.find((item) => {
    return item.id === Number(mostFreqProduct);
  });

  const mostFreqUser = findKeyWithGreatestValue(customerCount ?? {});
  const topUserDataIndex = salesNumber?.data?.findIndex((item) => {
    return item.email === mostFreqUser;
  });
  const topUserData = salesNumber?.data?.[topUserDataIndex];

  const { data: frequentProductData, isLoading: loadingFrequentProduct } =
    useQuery({
      queryKey: ["seller", "frequentProduct"],
      queryFn: async () => {
        return await supabase.rpc("get_most_frequent_product");
      },
    });
  const { data: frequentUser, isLoading: loadingFrequentUser } = useQuery({
    queryKey: ["seller", "frequentUser5"],
    queryFn: async () => {
      return await supabase.rpc("get_most_frequent_user_5");
    },
  });
  const { data: recentSalesData, isLoading: loadingRecentSales } = useQuery({
    queryKey: ["seller", "recent-sales"],
    queryFn: async () => {
      return await supabase
        .from("purchases")
        .select("*")
        .in("product_id", productIds)
        .order("created_at", {
          ascending: false,
        });
    },
    enabled: Boolean(productIds && productIds?.length > 0),
  });
  console.log(recentSalesData);

  const frequentProduct = frequentProductData?.data?.[0];

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Link href="/" className="font-bold text-xl">
              LeArté
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              {/* <CalendarDateRangePicker />
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button> */}
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatRupiah(totalRevenue ?? 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Customers
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.keys(customerCount ?? {}).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Number of Sales
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {salesNumber?.data?.length ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Products
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {productsNumber?.data?.length ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +15 since last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Most Popular Product
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {freqProductData?.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {freqProductData?.category}
                      </span>
                      <span className="text-xs">-</span>
                      <span className="text-xs">
                        {formatRupiah(freqProductData?.price ?? 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Top Spending User
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="flex items-center gap-2">
                    <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                      <AvatarImage src={topUserData?.avatar} alt="Avatar" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-2xl font-bold">
                        {topUserData?.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{topUserData?.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made {recentSalesData?.data?.length} sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminRecentSales recentSalesData={recentSalesData} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
