import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/store/apis/products";
import { Skeleton } from "./ui/skeleton";
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "bg-white w-full border border-white rounded-lg pt-0 gap-4",
        className
      )}
    >
      <CardHeader className="bg-white rounded-lg px-0 flex items-center justify-center !h-44">
        <Skeleton className="h-full w-full rounded-lg" />
      </CardHeader>
      <CardContent className="mt-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
function ProductCard({
  className,
  product,
}: Readonly<{ className?: string; product?: Product }>) {
  const product_image =
    product?.images.find((image) => image.isPrimary)?.url ||
    "/images/no_product_image.png";
  return (
    <Card
      className={cn(
        "w-full border border-t-0 border-white bg-transparent rounded-lg pt-0 gap-4",
        className
      )}
    >
      {product_image === "/images/no_product_image.png" ? (
        <CardHeader className="bg-white rounded-lg px-0  flex items-center justify-center !h-44">
          <Image
            src={product_image}
            width={150}
            height={150}
            className="object-cover h-full w-full rounded-lg"
            alt="flag-icon"
          />
        </CardHeader>
      ) : (
        <CardHeader className="bg-white rounded-lg px-0  flex items-center justify-center !h-44">
          <Image
            src={product_image}
            width={150}
            height={150}
            className="object-cover h-full w-full rounded-lg"
            alt="flag-icon"
          />
        </CardHeader>
      )}
      <CardContent className="">
        <CardTitle className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-secondary ">
            {product?.name}
          </p>
          <span className="flex items-center gap-2">
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              className="size-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.33967 3.65497C6.07855 2.32949 6.44799 1.66675 7.00033 1.66675C7.55266 1.66675 7.9221 2.32949 8.66098 3.65497L8.85214 3.99788C9.0621 4.37454 9.16709 4.56287 9.33078 4.68714C9.49446 4.8114 9.69833 4.85752 10.1061 4.94978L10.4773 5.03376C11.9121 5.35841 12.6295 5.52073 12.8002 6.06959C12.9708 6.61846 12.4818 7.19037 11.5036 8.3342L11.2505 8.63013C10.9726 8.95517 10.8336 9.11769 10.7711 9.31875C10.7085 9.51981 10.7296 9.73665 10.7716 10.1703L10.8098 10.5651C10.9577 12.0913 11.0317 12.8543 10.5848 13.1935C10.138 13.5328 9.46626 13.2235 8.12285 12.6049L7.77529 12.4449C7.39354 12.2691 7.20266 12.1812 7.00033 12.1812C6.79799 12.1812 6.60712 12.2691 6.22536 12.4449L5.8778 12.6049C4.53439 13.2235 3.86268 13.5328 3.41583 13.1935C2.96898 12.8543 3.04292 12.0913 3.19081 10.5651L3.22907 10.1703C3.27109 9.73665 3.2921 9.51981 3.22958 9.31875C3.16705 9.11769 3.02807 8.95517 2.75011 8.63013L2.49705 8.3342C1.51889 7.19037 1.02981 6.61846 1.20049 6.06959C1.37117 5.52073 2.08858 5.35841 3.52339 5.03376L3.89459 4.94978C4.30232 4.85752 4.50619 4.8114 4.66988 4.68714C4.83357 4.56287 4.93855 4.37454 5.14851 3.99788L5.33967 3.65497Z"
                stroke="#3B3C36"
              />
            </svg>
            <p className="text-sm font-semibold text-secondary">4.5</p>
          </span>
        </CardTitle>
        <p className="mt-2 text-primary text-base font-semibold truncate">
          {product?.description}
        </p>
        <p className="mt-4 text-base font-semibold text-secondary">
          {product?.price} {product?.currencyCode}
        </p>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
