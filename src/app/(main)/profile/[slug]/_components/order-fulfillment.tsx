"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function OrderFulfillment() {
  return (
    <div className="mt-8 p-4 bg-white rounded-xl inline-flex flex-col justify-start items-start gap-8 w-full">
      <h3 className="self-stretch justify-center text-stone-700 text-xl font-normal font-['Manrope'] leading-loose">
        Order Fulfillment
      </h3>
      <div className="self-stretch inline-flex justify-between items-center w-full">
        <div className="flex items-start flex-col gap-2">
          <p className="self-stretch justify-center text-stone-700 text-2xl font-medium font-['Manrope'] leading-9">
            1200
          </p>
          <h4 className="self-stretch justify-center text-stone-700 text-sm font-normal font-['Manrope'] leading-tight">
            Received Orders
          </h4>
          <div className="w-64 h-3 bg-blue-400 rounded-lg" />
        </div>
        <div className="flex items-start flex-col gap-2">
          <p className="self-stretch justify-center text-stone-700 text-2xl font-medium font-['Manrope'] leading-9">
            1200
          </p>
          <h4 className="self-stretch justify-center text-stone-700 text-sm font-normal font-['Manrope'] leading-tight">
            In-Progress Orders
          </h4>
          <div className="w-64 h-3 bg-orange-400 rounded-lg" />
        </div>
        <div className="flex items-start flex-col gap-2">
          <p className="self-stretch justify-center text-stone-700 text-2xl font-medium font-['Manrope'] leading-9">
            1200
          </p>
          <h4 className="self-stretch justify-center text-stone-700 text-sm font-normal font-['Manrope'] leading-tight">
            Completed Orders
          </h4>
          <div className="w-64 h-3 bg-emerald-600 rounded-lg" />
        </div>
      </div>
      <Table>
        <TableHeader className="bg-stone-200 ">
          <TableRow className="bg-stone-200 hover:bg-stone-200 w-full">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-44">Customer Name</TableHead>
            <TableHead className="w-44">Product Name</TableHead>
            <TableHead className="w-20">Quantity</TableHead>
            <TableHead className="w-60">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:hover:!bg-transparent [&_tr]:!border-b-0">
          <TableRow>
            <TableCell className="font-medium">1200</TableCell>
            <TableCell>Mohamed</TableCell>
            <TableCell>Galaxy Gear 3</TableCell>
            <TableCell>100</TableCell>
            <TableCell>
              <div
                data-state="Received"
                className="w-56 px-2 py-2 bg-blue-400 rounded-[100px] inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-center text-white text-xs font-normal font-['Manrope'] leading-none">
                  Received Order
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1200</TableCell>
            <TableCell>Mohamed</TableCell>
            <TableCell>Galaxy Gear 3</TableCell>
            <TableCell>100</TableCell>
            <TableCell>
              <div
                data-state="in-progress"
                className="w-56 px-2 py-2 bg-orange-400 rounded-[100px] inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-center text-black text-xs font-normal font-['Manrope'] leading-none">
                  In-Progress Order
                </div>
              </div>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">1200</TableCell>
            <TableCell>Mohamed</TableCell>
            <TableCell>Galaxy Gear 3</TableCell>
            <TableCell>100</TableCell>
            <TableCell>
              <div
                data-state="Completed"
                className="w-56 px-2 py-2 bg-emerald-600 rounded-[100px] inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-center text-white text-xs font-normal font-['Manrope'] leading-none">
                  Completed Order
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1200</TableCell>
            <TableCell>Mohamed</TableCell>
            <TableCell>Galaxy Gear 3</TableCell>
            <TableCell>100</TableCell>
            <TableCell>
              <div
                data-state="in-progress"
                className="w-56 px-2 py-2 bg-orange-400 rounded-[100px] inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-center text-black text-xs font-normal font-['Manrope'] leading-none">
                  {" "}
                  In-Progress Order
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1200</TableCell>
            <TableCell>Mohamed</TableCell>
            <TableCell>Galaxy Gear 3</TableCell>
            <TableCell>100</TableCell>
            <TableCell>
              <div
                data-state="in-progress"
                className="w-56 px-2 py-2 bg-orange-400 rounded-[100px] inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-center text-black text-xs font-normal font-['Manrope'] leading-none">
                  {" "}
                  In-Progress Order
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
    </div>
  );
}

export default OrderFulfillment;
