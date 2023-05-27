import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import DashboardLayout from "@/layout/DashboardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import supabase from "@/lib/supahase";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "react-query";
import { DataTable } from "@/components/ui/table";

const categories = [
  { label: "3D", value: "3D" },
  { label: "Self-Development", value: "Self-Development" },
  { label: "Comic and Graphic", value: "Comic and Graphic" },
  { label: "Education Film", value: "Education Film" },
  { label: "Audio", value: "Audio" },
  { label: "Recorded Music", value: "Recorded Music" },
  { label: "Fitness and Health", value: "Fitness and Health" },
];

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Product name must be at least 5 characters.",
  }),
  price: z.string().min(1, {
    message: "Insert 0 if your product is free",
  }),
  description: z.string().min(1, {
    message: "Product description is required",
  }),
  thumbnail: z.string().min(1, {
    message: "Product thumbnail is required",
  }),
  resource: z.string().min(1, {
    message: "Product resource is required",
  }),
  category: z.string().min(1, {
    message: "Product category is required",
  }),
});

const DashboardProducts = () => {
  const queryClient = useQueryClient();
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingResource, setLoadingResource] = useState(false);
  const [loadingUploadProduct, setLoadingUploadProduct] = useState(false);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      thumbnail: "",
      resource: "",
      category: "",
    },
  });

  const { user } = useUser();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingUploadProduct(true);
      const { data, error } = await supabase
        .from("product")
        .insert([
          {
            ...values,
            user_id: user.id,
          },
        ])
        .select("*");
      if (data) {
        setUploadDialogOpen(false);
        queryClient.invalidateQueries({
          queryKey: [user.id, "products"],
        });
      }
      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUploadProduct(false);
    }
  };

  const handleUploadThumbnail = async (e) => {
    try {
      setLoadingThumbnail(true);
      const file = e.target.files[0];
      const path = `${user.id}/${new Date().getTime()}`;
      const { data, error } = await supabase.storage
        .from("product_thumbnail")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (data) {
        form.setValue("thumbnail", data.path);
        await form.trigger("thumbnail");
      }
      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingThumbnail(false);
    }
  };

  const handleUploadResource = async (e) => {
    try {
      setLoadingResource(true);
      const file = e.target.files[0];
      const path = `${user.id}/${new Date().getTime()}`;
      const { data, error } = await supabase.storage
        .from("product_resource")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (data) {
        form.setValue("resource", data.path);
        await form.trigger("resource");
      }
      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResource(false);
    }
  };

  const { data } = useQuery({
    queryKey: [user?.id, "products"],
    queryFn: async () => {
      return await supabase.from("product").select("*").eq("user_id", user.id);
    },
    enabled: !!user,
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="font-bold text-2xl">Products</div>
        {/* Add Product Dialog */}
        <div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>+ Add New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>List New Product</DialogTitle>
                <DialogDescription>
                  Add new product yo your listing to start selling and gain
                  revenue
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-x-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="insert your product name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="insert your product price"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell customer about your product"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-8 mt-3">
                      <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center">
                                Product Thumbnail{" "}
                                {loadingThumbnail && (
                                  <div className="text-xs text-gray-600 ml-2 italic">
                                    uploading...
                                  </div>
                                )}
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input
                                accept="image/jpeg,image/png"
                                type="file"
                                placeholder="Showcase your product"
                                className="resize-none"
                                onChange={handleUploadThumbnail}
                              />
                            </FormControl>
                            {/* <FormDescription>
                              Picture that will be displayed as product
                              thumbnail
                            </FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="resource"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center">
                                Product File{" "}
                                {loadingResource && (
                                  <div className="text-xs text-gray-600 ml-2 italic">
                                    uploading...
                                  </div>
                                )}
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                placeholder="Upload your product"
                                className="resize-none"
                                onChange={handleUploadResource}
                              />
                            </FormControl>
                            {/* <FormDescription>
                              Product file that will be sent to customer
                            </FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a verified email to display" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((item) => {
                                  return (
                                    <SelectItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button type="submit">
                      {loadingUploadProduct ? "Publishing.." : "Publish"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Product List */}
      <div>
        <DataTable
          columns={[
            {
              accessorKey: "name",
              header: () => <div className="text-left">Name</div>,
            },
            {
              accessorKey: "price",
              header: () => <div className="text-left">Price</div>,
              cell: ({ row }) => {
                const amount = parseFloat(row.getValue("price"));
                const formatted = new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(amount);

                return <div className="text-left font-medium">{formatted}</div>;
              },
            },
            {
              accessorKey: "description",
              header: () => <div className="text-left">Description</div>,
            },
          ]}
          data={data.data}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardProducts;
