"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

// Components
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Types and API
import { Product, useGetSavedProductsQuery } from "@/store/apis/products";

// Schema for form validation
const SearchFormSchema = z.object({
  search: z.string().max(100),
});

type SearchForm = z.infer<typeof SearchFormSchema>;

// This component contains the logic that uses useSearchParams
function SavesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientSideSearch, setClientSideSearch] = useState("");
  // Get all search params as an object
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const {
    search: searchTerm = "",
    categoryId,
    available,
    minRate,
    minPrice,
    maxPrice,
  } = searchParamsObj;
  // Fetch saved products
  const { data, isLoading, error } = useGetSavedProductsQuery({
    ...(searchTerm && { search: searchTerm }),
    ...(categoryId && { categoryId }),
    ...(available && { available: available === "true" ? "true" : "false" }),
    ...(minRate && { minRate }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
  });

  const form = useForm<SearchForm>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: searchParams.get("search") || "",
    },
  });

  // Filter products based on client-side search
  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    if (!clientSideSearch) return data.data;

    const searchLower = clientSideSearch.toLowerCase();
    return data.data.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
    );
  }, [data, clientSideSearch]);

  // Handle search submission
  const onSubmit = (formData: SearchForm) => {
    setClientSideSearch(formData.search);
  };

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    form.setValue("search", searchValue);
    setClientSideSearch(searchValue);
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load saved products. Please try again later.");
    }
  }, [error]);

  return (
    <div className="w-full flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start justify-start gap-2">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-semibold">Saved Items</h1>
          {!isLoading && data?.data && (
            <p className="text-sm text-muted-foreground">
              {data.data.length} {data.data.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>
        <p className="text-base text-muted-foreground">
          Your shortlist for smart sourcing decisions
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <div className="relative w-full">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    onChange={handleSearchChange}
                    placeholder="Search your saved items..."
                    className="border-secondary rounded-full placeholder:text-secondary"
                  />
                </div>
              )}
            />
          </form>
        </Form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive mb-4">Failed to load saved items</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-2">
            {clientSideSearch
              ? "No saved items match your search."
              : "You have no saved items yet."}
          </p>
          {clientSideSearch ? (
            <button
              onClick={() => {
                form.reset({ search: "" });
                setClientSideSearch("");
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          ) : (
            <button
              onClick={() => router.push("/marketplace")}
              className="text-sm text-primary hover:underline"
            >
              Browse marketplace
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// Main page component that wraps the content in a Suspense boundary
export default function SavesPage() {
  return (
    <Suspense fallback={
      <div className="w-full flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-12 w-full max-w-2xl bg-gray-200 rounded-full animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    }>
      <SavesContent />
    </Suspense>
  );
}
