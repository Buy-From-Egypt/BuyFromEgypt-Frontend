"use client";
import Image from "next/image";
import React from "react";

function CompanyDetails({
  type = "company",
  time,
}: Readonly<{ type?: "company" | "time"; time?: string }>) {
  return (
    <div className="flex items-center justify-start gap-2">
      <Image
        src="/images/user-placeholder.png"
        alt="logo"
        width={24}
        className="size-10 rounded-full object-contain"
        height={24}
      />
      <div className="flex items-start justify-start flex-col gap-0.5">
        <h4 className="capitalize text-xl font-semibold ">Company Name</h4>
        {type === "company" ? (
          <p className="text-base">Electronics</p>
        ) : (
          type === "time" && <p className="text-base">{time}</p>
        )}
      </div>
    </div>
  );
}

export default CompanyDetails;
