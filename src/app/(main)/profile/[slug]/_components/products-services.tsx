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

function ProductsServices() {
  return (
    <div className="bg-white p-4 flex flex-col gap-4 rounded-xl mt-6">
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
            Product Categories
          </h3>
          <Pencil className="text-stone-600 size-4" />
        </div>
        <ul className="flex flex-row gap-10 px-4">
          <span className="flex items-start flex-col gap-2 ">
            <li className="list-disc text-secondary text-sm font-normal leading-tight">
              Category 1
            </li>
            <li className="list-disc text-secondary text-sm font-normal leading-tight">
              Category 2
            </li>
          </span>
          <span className="flex items-start flex-col gap-2 ">
            <li className="list-disc text-secondary text-sm font-normal leading-tight">
              Category 1
            </li>
            <li className="list-disc text-secondary text-sm font-normal leading-tight">
              Category 2
            </li>
          </span>
        </ul>
      </div>
      <Separator className="bg-stone-200" />
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex items-center justify-between gap-3">
          <span className="flex flex-row items-center justify-start gap-3">
            <h3 className="text-xl font-normal leading-loose text-stone-700">
              Product Listings
            </h3>
            <Pencil className="text-stone-600 size-4" />
          </span>
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
        </div>
        <div className="flex flex-row gap-10 px-4">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full py-4"
          >
            <CarouselContent className="w-full">
              {Array.from({ length: 8 }).map((_, index) => (
                <CarouselItem
                  key={index + 1 - 1}
                  className="md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard className="!shadow-none !border-main-bg" />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
          </Carousel>
        </div>
      </div>
      <Separator className="bg-stone-200" />
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
            Export Services
          </h3>
          <Pencil className="text-stone-600 size-4" />
        </div>
        <ul className="list-disc px-4">
          <li className="text-secondary text-sm font-normal leading-tight">
            Logistics Support: Door-to-port delivery with global shipping
            partners
          </li>
          <li className="text-secondary text-sm font-normal leading-tight">
            Custom Packaging: Branded or neutral packaging on demand
          </li>
          <li className="text-secondary text-sm font-normal leading-tight">
            Product Testing: Quality control and testing services
          </li>
          <li className="text-secondary text-sm font-normal leading-tight">
            After-sales Coordination: Regional service partner support
          </li>
          <li className="text-secondary text-sm font-normal leading-tight">
            Documentation: Export invoices, COO, packing list, conformity certs
          </li>
        </ul>
      </div>
      <Separator className="bg-stone-200" />
       <div className="flex flex-col gap-4 justify-start">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
           Why Partner With Samsung Egypt ?
          </h3>
          <Pencil className="text-stone-600 size-4" />
        </div>
        <ul className="list-disc leading-tight px-4">
          <li className="text-secondary text-sm font-normal leading-tight">
            Logistics Support: Door-to-port delivery with global shipping
            partners
          </li>
          <li className="text-secondary text-sm font-normal leading-tight">
            Custom Packaging: Branded or neutral packaging on demand
          </li>
          <li className="text-secondary text-sm font-normal leading-tight">
            Product Testing: Quality control and testing services
          </li>
          <li className="text-secondary text-sm font-normal leading-tight">
            After-sales Coordination: Regional service partner support
          </li>
          <li className="text-secondary text-sm font-normal leading-tight">
            Documentation: Export invoices, COO, packing list, conformity certs
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProductsServices;
