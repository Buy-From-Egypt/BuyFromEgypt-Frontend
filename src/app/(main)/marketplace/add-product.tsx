"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileInput } from "@/components/ui/input-file";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddProductMutation, useGetCategoriesQuery, type Category } from "@/store/apis/products";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const AddProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.string(),
  description: z.string().min(10).max(1000),
  categoryId: z.string().min(1, "Category is required"),
  currencyCode: z.string(),
  images: z.array(z.instanceof(File)).optional(),
});
type AddProductInput = z.infer<typeof AddProductSchema>;
function AddProduct({
  is_open,
  onOpenChange,
}: {
  is_open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [newProduct, { isLoading }] = useAddProductMutation();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  
  const form = useForm<AddProductInput>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      categoryId: "",
      currencyCode: "EGP",
      images: [],
    },
  });
  const onSubmit = async (values: AddProductInput) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("categoryId", values.categoryId);
      formData.append("currencyCode", values.currencyCode);
      values.images?.forEach((file) => {
        formData.append("images", file);
      });
      await newProduct(formData).unwrap();
      toast.success("Product created successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }
  };
  return (
    <Dialog open={is_open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white  p-0">
        <DialogHeader className="text-start space-y-3 bg-main-bg rounded-t-lg p-4">
          <DialogTitle className="text-start font-normal">
            Create Product
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2 px-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
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
                  <FormControl>
                    <Input placeholder="Product price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Currency code" {...field} />
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
                  <FormControl>
                    <Textarea placeholder="Product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingCategories 
                            ? "Loading categories..." 
                            : "Select a category"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesData?.data.map((category: Category) => (
                        <SelectItem key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileInput
                      value={field.value}
                      onChange={field.onChange}
                      accept="image/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading || isLoadingCategories} 
              className="w-full"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProduct;
