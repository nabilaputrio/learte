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
import { AdminNav } from "@/components/admin-nav";
import { AdminOverview } from "@/components/admin-overview";
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

export default function DashboardPage() {
  const { data: revenueData, isLoading: loadingRevenue } = useQuery({
    queryKey: ["admin", "revenue"],
    queryFn: async () => {
      return await supabase.rpc("calculate_paid_total_sum");
    },
  });

  const { data: customerData, isLoading: loadingCustomerData } = useQuery({
    queryKey: ["admin", "customerCount"],
    queryFn: async () => {
      return await supabase.rpc("count_distinct_users");
    },
  });

  const { data: salesNumber, isLoading: loadingSalesNumber } = useQuery({
    queryKey: ["admin", "salesNumber"],
    queryFn: async () => {
      return await supabase.rpc("count_purchases");
    },
  });

  const { data: productsNumber, isLoading: loadingProductNumber } = useQuery({
    queryKey: ["admin", "productNumber"],
    queryFn: async () => {
      return await supabase.rpc("count_products");
    },
  });

  const { data: frequentProductData, isLoading: loadingFrequentProduct } =
    useQuery({
      queryKey: ["admin", "frequentProduct"],
      queryFn: async () => {
        return await supabase.rpc("get_most_frequent_product");
      },
    });
  const { data: frequentUser, isLoading: loadingFrequentUser } = useQuery({
    queryKey: ["admin", "frequentUser5"],
    queryFn: async () => {
      return await supabase.rpc("get_most_frequent_user_5");
    },
  });
  const { data: recentSalesData, isLoading: loadingRecentSales } = useQuery({
    queryKey: ["admin", "recent-sales"],
    queryFn: async () => {
      return await supabase.from("purchases").select("*").order("created_at", {
        ascending: false,
      });
    },
  });

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
            <AdminNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
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
                      {formatRupiah(revenueData?.data ?? 0)}
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
                      {customerData?.data ?? 0}
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
                      {salesNumber?.data ?? 0}
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
                      {productsNumber?.data ?? 0}
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
                      {frequentProduct?.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {frequentProduct?.category}
                      </span>
                      <span className="text-xs">-</span>
                      <span className="text-xs">
                        {formatRupiah(frequentProduct?.price ?? 0)}
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
                      <AvatarImage
                        src={frequentUser?.data?.[0]?.user_avatar}
                        alt="Avatar"
                      />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-2xl font-bold">
                        {frequentUser?.data?.[0]?.user_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {frequentUser?.data?.[0]?.user_email}
                        </span>
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
                    <AdminOverview />
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
