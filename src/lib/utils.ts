import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getThumbnailUrl(path) {
  return `https://yxjisctnsmttpbuoqiny.supabase.co/storage/v1/object/public/product_thumbnail/${path}`;
}

export function getResourceDownloadUrl(path) {
  return `https://yxjisctnsmttpbuoqiny.supabase.co/storage/v1/object/public/product_resource/${path}?download=`;
}

export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}
