"use client";

import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useQuery } from "react-query";
import supabase from "@/lib/supabase";
import { formatRupiah } from "@/lib/utils";

const months = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Okt",
  11: "Nov",
  12: "Des",
};

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function AdminOverview() {
  const { data: sales, isLoading: loadingSales } = useQuery({
    queryKey: ["admin", "salesChart"],
    queryFn: async () => {
      return await supabase.from("purchases").select("*");
    },
  });
  const purchaseData = sales?.data?.reduce((acc, cur) => {
    const purchaseDate = new Date(cur.created_at).getDate();
    const purchaseMonth = new Date(cur.created_at).getMonth();
    if (!acc[`${purchaseDate}-${purchaseMonth}`]) {
      acc[`${purchaseDate}-${purchaseMonth}`] = cur.total;
    } else {
      acc[`${purchaseDate}-${purchaseMonth}`] += cur.total;
    }
    return acc;
  }, {});
  const dataKeys = Object.keys(purchaseData ?? {})
    .reverse()
    .slice(0, 30)
    .reverse();
  const chartData = dataKeys.map((key) => {
    return {
      name: `${key.split("-")[0]} ${months[key.split("-")[1]]}`,
      total: purchaseData[key],
    };
  });
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${formatRupiah(value)}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
