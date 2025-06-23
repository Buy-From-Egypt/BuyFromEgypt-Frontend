import React from "react";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProfileResponse } from "@/store/apis/profile";
import Link from "next/link";
import { Product } from "@/store/apis/products";

function ProductsServices({ data }: { data: ProfileResponse }) {
  const products = data.products || [];
  const categories = data.categories || [];

  // Split categories into two columns for better display
  const midPoint = Math.ceil(categories.length / 2);
  const firstColumn = categories.slice(0, midPoint);
  const secondColumn = categories.slice(midPoint);

  return (
    <div className="bg-white p-4 flex flex-col gap-6 rounded-xl mt-6">
      {/* Product Categories */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-start gap-3">
            <h3 className="text-xl font-normal leading-loose text-stone-700">
              Product Categories
            </h3>
          </div>
          <div className="flex flex-row gap-10 px-4">
            {firstColumn.length > 0 && (
              <ul className="flex flex-col gap-2">
                {firstColumn.map((category) => (
                  <li
                    key={category.categoryId}
                    className="list-disc text-secondary text-sm font-normal leading-tight ml-4"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
            {secondColumn.length > 0 && (
              <ul className="flex flex-col gap-2">
                {secondColumn.map((category) => (
                  <li
                    key={category.categoryId}
                    className="list-disc text-secondary text-sm font-normal leading-tight ml-4"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {products.length > 0 && (
        <>
          <Separator className="bg-stone-200" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-normal leading-loose text-stone-700">
                Product Listings
              </h3>
              <Link href="/marketplace">
                <Button className="rounded-full w-44 flex items-center justify-between !px-4 !py-2">
                  <p className="text-sm text-white font-normal">Explore All</p>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.75 5.0625C6.43934 5.0625 6.1875 4.81066 6.1875 4.5C6.1875 4.18934 6.43934 3.9375 6.75 3.9375H13.5C13.8107 3.9375 14.0625 4.18934 14.0625 4.5V11.25C14.0625 11.5607 13.8107 11.8125 13.5 11.8125C13.1893 11.8125 12.9375 11.5607 12.9375 11.25V5.85799L4.89775 13.8977C4.67808 14.1174 4.32192 14.1174 4.10225 13.8977C3.88258 13.6781 3.88258 13.3219 4.10225 13.1023L12.142 5.0625H6.75Z"
                      fill="white"
                    />
                  </svg>
                </Button>
              </Link>
            </div>
            <div className="px-4">
              <Carousel
                opts={{
                  align: "start",
                  skipSnaps: true,
                }}
                className="w-full py-4"
              >
                <CarouselContent className="w-full">
                  {products.map((product) => {
                    return (
                      <CarouselItem
                        key={product.productId}
                        className="md:basis-1/3 lg:basis-1/4"
                      >
                        <ProductCard
                          product={product}
                          className="!shadow-none !border-main-bg"
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          </div>
        </>
      )}
      {/* Export Services */}
      {/* <Separator className="bg-stone-200" /> */}
      <div className="flex flex-col gap-4">
        {/* <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
            Export Services
          </h3>
          {data.userId && (
            <button className="text-stone-600 hover:text-stone-800">
              <Pencil className="size-4" />
            </button>
          )}
        </div> */}
        {/* <ul className="list-disc px-4 space-y-2">
          {data.exportServices?.length > 0 ? (
            data.exportServices.map((service, index) => (
              <li key={index} className="text-secondary text-sm font-normal leading-tight ml-4">
                {service}
              </li>
            ))
          ) : (
            <li className="text-secondary/70 text-sm font-normal leading-tight ml-4 italic">
              No export services listed
            </li>
          )}
        </ul> */}
      </div>

      {/* Company Information */}
      {/* <Separator className="bg-stone-200" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
            Why Partner With Us?
          </h3>
          {data.userId && (
            <button className="text-stone-600 hover:text-stone-800">
              <Pencil className="size-4" />
            </button>
          )}
        </div>
        <ul className="list-disc px-4 space-y-2">
          {data.companyInfo?.length > 0 ? (
            data.companyInfo.map((info, index) => (
              <li key={index} className="text-secondary text-sm font-normal leading-tight ml-4">
                {info}
              </li>
            ))
          ) : (
            <li className="text-secondary/70 text-sm font-normal leading-tight ml-4 italic">
              No company information available
            </li>
          )}
        </ul>
      </div> */}
    </div>
  );
}

export default ProductsServices;
