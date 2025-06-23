"use client";

import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/store/apis/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(params.productId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Find the specific product by ID

  if (isLoading) {
    return (
      <div className="container px-4 py-8">Loading product details...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="container px-4 py-8">
        <p className="text-red-500">
          Error loading product. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Gallery */}

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(product.rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
            <p className="mt-4 text-3xl font-medium text-gray-900">
              {formatCurrency(product.price, product.currencyCode)}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">
              {product.description || "No description available."}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Details</h2>
            <div className="mt-2 space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {product.category?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Vendor:</span>{" "}
                {product.owner?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {product.active ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <ProductGallery
            images={product.images}
            className="max-w-2xl mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
