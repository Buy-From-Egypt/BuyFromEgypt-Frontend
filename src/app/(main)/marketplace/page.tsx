"use client";

import {
  useEffect,
  useRef,
  useState,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { debounce } from "lodash";

// Components
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Types and API
import { Product, useGetProductsQuery } from "@/store/apis/products";

// Schema for form validation
const SearchFormSchema = z.object({
  search: z.string().max(100),
});

type SearchForm = z.infer<typeof SearchFormSchema>;

// Constants
const PRODUCTS_PER_PAGE = 12;

function MarketplaceContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [clientSideSearch, setClientSideSearch] = useState("");

  // Filter products based on client-side search
  const filteredProducts = useMemo(() => {
    if (!clientSideSearch) return allProducts;
    const searchLower = clientSideSearch.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
    );
  }, [allProducts, clientSideSearch]);
  const loaderRef = useRef<HTMLDivElement>(null);
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
  const searchInputRef = useRef<HTMLInputElement>(null);

  // API Query
  const { data, isLoading, isFetching, error } = useGetProductsQuery(
    {
      ...(searchTerm && { search: searchTerm }),
      ...(categoryId && { categoryId }),
      ...(available && { available: available === "true" ? "true" : "false" }),
      ...(minRate && { minRate }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      page,
      limit: PRODUCTS_PER_PAGE,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  // Handle search params changes
  useEffect(() => {
    // Reset to first page when any search parameter changes
    setPage(1);
    setAllProducts([]);
    // Clear client-side search when server-side search changes
    setClientSideSearch("");
  }, [searchParams.toString()]);

  // Update products when data changes
  useEffect(() => {
    if (data?.data) {
      setAllProducts((prev) =>
        page === 1 ? data.data : [...prev, ...data.data]
      );
    }
  }, [data, page]);

  // Handle infinite scroll
  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && data?.meta?.NextPage) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(currentLoader);
    return () => observer.disconnect();
  }, [isFetching, data?.meta?.NextPage]);

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.length > 0) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      // Keep all other parameters intact
      router.push(
        `${pathname}${params.toString() ? `?${params.toString()}` : ""}`
      );
      setPage(1);
    }, 500),
    [pathname, router, searchParams]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle search submission
  const onSubmit = (values: SearchForm) => {
    if (values.search) {
      // Use client-side search for fast filtering
      setClientSideSearch(values.search);
    } else {
      setClientSideSearch("");
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setClientSideSearch("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Initialize form
  const form = useForm<SearchForm>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("search", value);
    setClientSideSearch(value.toLowerCase());
    debouncedSearch(value);
  };

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-4">
          Failed to load products. Please try again later.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">
          Discover top-quality Egyptian products and connect with trusted
          exporters
        </p>
      </div>

      {/* Search Bar */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <div className="flex-1 relative">
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 size-6 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="border-secondary rounded-full placeholder:text-secondary"
              {...form.register("search", {
                onChange: (e) => {
                  setClientSideSearch(e.target.value);
                },
              })}
            />
            {(form.watch("search") || clientSideSearch) && (
              <X
                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => {
                  form.setValue("search", "");
                  handleClearSearch();
                }}
              />
            )}
          </div>
        </form>
      </Form>

      {/* Products Grid */}
      {allProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {(clientSideSearch ? filteredProducts : allProducts).map(
              (product, index) => {
                // Create a more unique key using multiple product properties and array index
                const uniqueKey = `${product.productId}-${product.name}-${
                  product.updatedAt
                }-${product.createdAt || ""}-${index}`
                  .toLowerCase()
                  .replace(/\s+/g, "-") // Replace spaces with hyphens
                  .replace(/[^\w-]/g, ""); // Remove special characters

                return <ProductCard key={uniqueKey} product={product} />;
              }
            )}
          </div>
          {clientSideSearch && filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No products match your search.
              </p>
            </div>
          )}

          {/* Loading indicator for infinite scroll */}
          <div
            ref={loaderRef}
            className="h-20 w-full flex items-center justify-center"
            style={{ minHeight: "100px" }}
          >
            {isFetching && data?.meta?.NextPage && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Loading more products...
                </p>
              </div>
            )}
          </div>
        </>
      ) : !isLoading ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No products found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md px-4">
            {searchTerm
              ? `No products match your search for "${searchTerm}"`
              : "No products available at the moment. Please check back later."}
          </p>
        </div>
      ) : (
        // Initial loading state
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}
      <div ref={loaderRef} className="h-1" />
    </div>
  );
}

export default function Page() {
  return (
    <div className="container">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="h-10 w-64 bg-muted rounded-md animate-pulse mb-2" />
            <div className="h-5 w-96 bg-muted rounded-md animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <MarketplaceContent />
      </Suspense>
    </div>
  );
}
