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
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
const SearchFormSchema = z.object({
  search: z.string(),
});
type SearchForm = z.infer<typeof SearchFormSchema>;

export default function Page() {
  const searchParams = useSearchParams();

  // const getParams = new URLSearchParams(searchParams.toString());
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
//  <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M9.5 14C11.1569 14 12.5 15.3431 12.5 17C12.5 18.6568 11.1569 20 9.5 20C7.84315 20 6.5 18.6568 6.5 17C6.5 15.3431 7.84315 14 9.5 14Z"
//                   stroke="#3B3C36"
//                   strokeWidth="1.5"
//                 />
//                 <path
//                   d="M14.5 3.99998C12.8431 3.99998 11.5 5.34312 11.5 6.99998C11.5 8.65683 12.8431 9.99998 14.5 9.99998C16.1569 9.99998 17.5 8.65683 17.5 6.99998C17.5 5.34312 16.1569 3.99998 14.5 3.99998Z"
//                   stroke="#3B3C36"
//                   strokeWidth="1.5"
//                 />
//                 <path
//                   d="M15 16.9585L22 16.9585"
//                   stroke="#3B3C36"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M9 6.9585L2 6.9585"
//                   stroke="#3B3C36"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M2 16.9585L4 16.9585"
//                   stroke="#3B3C36"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M22 6.9585L20 6.9585"
//                   stroke="#3B3C36"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                 />
//               </svg>