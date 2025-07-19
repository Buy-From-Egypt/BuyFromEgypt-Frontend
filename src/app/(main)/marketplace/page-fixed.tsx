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
import { debounce } from "lodash";

// Components
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types and API
import { Product, useGetProductsQuery } from "@/store/apis/products";
import { useGetProductRecommendationsByUserIdQuery } from "@/store/apis/recommendations";
import { useAuth } from "@/context/AuthContext";
import AddProduct from "./add-product";

// Schema for form validation
const SearchFormSchema = z.object({
  search: z.string().max(100),
});

type SearchForm = z.infer<typeof SearchFormSchema>;
const PRODUCTS_PER_PAGE = 12;

function MarketplaceContent() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [clientSideSearch, setClientSideSearch] = useState("");
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all-products");

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

  // API Query for all products
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
      skip: activeTab !== "all-products",
    }
  );

  // Recommendations API Query
  const {
    data: recommendationsData,
    isLoading: isLoadingRecommendations,
    error: recommendationsError,
  } = useGetProductRecommendationsByUserIdQuery(
    { userId: user?.userId || "", num_recommendations: 20 },
    { skip: !user?.userId || activeTab !== "ai-suggestions" }
  );

  // Handle search params changes
  const searchParamsString = searchParams.toString();
  useEffect(() => {
    // Reset to first page when any search parameter changes
    setPage(1);
    setAllProducts([]);
    // Clear client-side search when server-side search changes
    setClientSideSearch("");
  }, [searchParamsString]);

  // Update products when data changes
  useEffect(() => {
    if (data?.data && activeTab === "all-products") {
      setAllProducts((prev) =>
        page === 1 ? data.data : [...prev, ...data.data]
      );
    }
  }, [data, page, activeTab]);

  // Handle infinite scroll
  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader || activeTab !== "all-products") return;

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
  }, [isFetching, data?.meta?.NextPage, activeTab]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      const params = new URLSearchParams(searchParams);

      if (search.length > 0) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

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
      setClientSideSearch(values.search);
    } else {
      setClientSideSearch("");
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setClientSideSearch("");
  };

  // Initialize form
  const form = useForm<SearchForm>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  // Show error state
  if (error && activeTab === "all-products") {
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
      <AddProduct is_open={addProductOpen} onOpenChange={setAddProductOpen} />

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <Button onClick={() => setAddProductOpen(true)}>Add Product</Button>
        </div>
        <p className="text-muted-foreground">
          Discover top-quality Egyptian products and connect with trusted
          exporters
        </p>
      </div>

      {/* Tabs for All Products vs AI Suggestions */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-fit p-1 h-12 bg-white rounded-lg border">
          <TabsTrigger
            value="all-products"
            className="rounded-md text-primary data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
          >
            All Products
          </TabsTrigger>
          {user && (
            <TabsTrigger
              value="ai-suggestions"
              className="rounded-md text-primary data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
            >
              AI Suggestions
            </TabsTrigger>
          )}
        </TabsList>

        {/* All Products Tab Content */}
        <TabsContent value="all-products" className="space-y-6">
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
                    const uniqueKey = `${product.productId}-${product.name}-${
                      product.updatedAt
                    }-${product.createdAt || ""}-${index}`
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]/g, "");

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
            <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No products found
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Try adjusting your search criteria or browse all products to
                discover what&apos;s available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* AI Suggestions Tab Content */}
        <TabsContent value="ai-suggestions" className="space-y-6">
          {isLoadingRecommendations ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={`rec-skeleton-${i}`} />
              ))}
            </div>
          ) : recommendationsError ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg">
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Failed to load recommendations
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Please make sure you have set your preferences in your profile.
              </p>
            </div>
          ) : recommendationsData?.data?.recommendations?.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>AI Recommendations:</strong>{" "}
                  {recommendationsData.data.recommendation_reason}
                </p>
                {recommendationsData.data.used_preferences && (
                  <p className="text-xs text-blue-600 mt-2">
                    Based on your interests in:{" "}
                    {recommendationsData.data.used_preferences.selected_industries?.join(
                      ", "
                    )}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {recommendationsData.data.recommendations.map(
                  (product: Product, index: number) => {
                    const uniqueKey = `rec-${product.productId}-${index}`;
                    return <ProductCard key={uniqueKey} product={product} />;
                  }
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg">
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No recommendations available
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Set your preferences in your profile to get personalized product
                recommendations.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
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
