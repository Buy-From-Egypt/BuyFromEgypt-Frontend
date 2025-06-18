"use client";

import ProductCard from "@/components/product-card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Product, useGetProductsQuery } from "@/store/apis/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SearchFormSchema = z.object({
  search: z.string(),
});
type SearchForm = z.infer<typeof SearchFormSchema>;

function MarketplaceContent() {
  const searchParams = useSearchParams();

  const queryParams = searchParams
    ? Object.fromEntries(searchParams.entries())
    : {};

  const { data, isLoading } = useGetProductsQuery(
    { ...queryParams },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const form = useForm<SearchForm>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  function onSubmit(data: SearchForm) {
    console.log(data);
  }

  if (isLoading) return <div>Loading...</div>;
  if (!data?.data) return <div>No products found</div>;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col items-start justify-start gap-2">
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="text-base text-secondary">
          Discover top-quality Egyptian products and connect with trusted
          exporters
        </p>
      </div>
      <div className="flex items-center justify-start gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-center justify-start gap-4"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <div className="relative w-full">
                  <Input
                    className="border-secondary rounded-full placeholder:text-secondary"
                    placeholder="Search for products"
                    {...field}
                  />
                  <button
                    onClick={form.handleSubmit(onSubmit)}
                    className="-mr-1.5 cursor-pointer hover:text-white absolute right-4 top-1/2 -translate-y-1/2 size-10 flex-center"
                  >
                    <Search />
                  </button>
                </div>
              )}
            />
          </form>
        </Form>

        <div className="cursor-pointer flex-center border border-secondary rounded-full size-12 p-2">
          {/* <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select> */}
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {data?.data?.map((product: Product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
