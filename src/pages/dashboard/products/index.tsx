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
import { MoreHorizontal } from "lucide-react";
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
import React, { useEffect } from "react";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DataTable } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";

const categories = [
  { label: "3D", value: "3D" },
  { label: "Self-Development", value: "Self-Development" },
  { label: "Comic and Graphic", value: "Comic and Graphic" },
  { label: "Education Film", value: "Education Film" },
  { label: "Audio", value: "Audio" },
  { label: "Recorded Music", value: "Recorded Music" },
  { label: "Fitness and Health", value: "Fitness and Health" },
];

const DashboardProducts = () => {
  const queryClient = useQueryClient();
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingResource, setLoadingResource] = useState(false);
  const [loadingUploadProduct, setLoadingUploadProduct] = useState(false);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();

  const formSchema = z.object({
    name: z
      .string()
      .min(5, {
        message: "Product name must be at least 5 characters.",
      })
      .max(50, {
        message: "Product name must be less that 50 characters",
      }),
    price: z.string().min(1, {
      message: "Insert 0 if your product is free",
    }),
    description: z.string().min(1, {
      message: "Product description is required",
    }),
    ...(selectedProduct
      ? {
          thumbnail: z.string(),
        }
      : {
          thumbnail: z.string().min(1, {
            message: "Product thumbnail is required",
          }),
        }),
    ...(selectedProduct
      ? {
          resource: z.string(),
        }
      : {
          resource: z.string().min(1, {
            message: "Product resource is required",
          }),
        }),
    category: z.string().min(1, {
      message: "Product category is required",
    }),
  });

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

  const onUpdate = async (values) => {
    updateProductMutation({
      id: selectedProduct.id,
      newData: Object.keys(values).reduce((acc, cur) => {
        if (!!values[cur]) {
          acc[cur] = values[cur];
        }
        return acc;
      }, {}),
    });
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

  const handleDeleteProduct = async () => {
    deleteProductMutation(selectedProduct.id);
  };

  const { data } = useQuery({
    queryKey: [user?.id, "products"],
    queryFn: async () => {
      return await supabase.from("product").select("*").eq("user_id", user.id);
    },
    enabled: !!user,
  });

  const { mutate: deleteProductMutation, isLoading: loadingDeleteProduct } =
    useMutation({
      mutationFn: async (productId) => {
        return await supabase.from("product").delete().eq("id", productId);
      },
      onSuccess: () => {
        setSelectedProduct(null);
        setDeleteDialogOpen(false);
        queryClient.invalidateQueries([user.id, "products"]);
      },
    });

  const { mutate: updateProductMutation, isLoading: loadingUpdateProduct } =
    useMutation({
      mutationFn: async (params: {
        id: string;
        newData: Record<string, string>;
      }) => {
        return await supabase
          .from("product")
          .update(params.newData)
          .eq("id", params.id)
          .select("*");
      },
      onSuccess: () => {
        setSelectedProduct(null);
        setUploadDialogOpen(false);
        queryClient.invalidateQueries([user.id, "products"]);
      },
    });

  useEffect(() => {
    if (!uploadDialogOpen) {
      form.reset();
    }
  }, [uploadDialogOpen, form]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="font-bold text-2xl">Products</div>
        {/* Add Product Dialog */}
        <div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedProduct(null)}>
                + Add New
              </Button>
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
                  onSubmit={form.handleSubmit(
                    selectedProduct ? onUpdate : onSubmit
                  )}
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
                                {selectedProduct && "New "}Product Thumbnail{" "}
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
                                {selectedProduct && "New "}Product File{" "}
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
                    {selectedProduct ? (
                      <Button type="submit">
                        {loadingUpdateProduct ? "Updating.." : "Update"}
                      </Button>
                    ) : (
                      <Button type="submit">
                        {loadingUploadProduct ? "Publishing.." : "Publish"}
                      </Button>
                    )}
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
              cell: ({ row }) => {
                return (
                  <div
                    role="button"
                    onClick={() => {
                      router.push(`/dashboard/products/${row.original.id}`);
                    }}
                    className="whitespace-nowrap line-clamp-1"
                  >
                    {String(row.original.name).slice(0.1)}
                  </div>
                );
              },
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
              cell: ({ row }) => {
                return (
                  <div className="line-clamp-1">
                    {String(row.original.description)}
                  </div>
                );
              },
            },
            {
              accessorKey: "category",
              header: () => <div className="text-left">Description</div>,
              cell: ({ row }) => {
                return (
                  <Badge className="whitespace-nowrap">
                    {row.original.category}
                  </Badge>
                );
              },
            },
            {
              accessorKey: "action",
              header: () => <div className="text-left">Action</div>,
              cell: ({ row }) => {
                const payment = row.original;

                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push(`/dashboard/products/${row.original.id}`);
                        }}
                      >
                        View Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(row.original);
                          form.setValue("name", row.original.name);
                          form.setValue("price", String(row.original.price));
                          form.setValue(
                            "description",
                            row.original.description
                          );
                          form.setValue("category", row.original.category);
                          setUploadDialogOpen(true);
                        }}
                      >
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(row.original);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ]}
          data={data?.data || []}
        />
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              product and remove all sales data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              {loadingDeleteProduct ? "Deleting.." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardProducts;
