"use client";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatTimeAgo } from "@/utils/time";

function CompanyDetails({
  type = "company",
  user,
  time,
}: Readonly<{
  type?: "company" | "time";
  time?: string;
  user?: {
    userId: string;
    name: string;
    profileImage: string;
  };
}>) {
  return (
    <div className="flex items-center justify-start gap-2">
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={user?.profileImage ?? "/images/user-placeholder.png"}
        />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
      {/* <Image
        src=""
        alt="logo"
        width={24}
        className="size-10 rounded-full object-contain"
        height={24}
      /> */}
      <div className="flex items-start justify-start flex-col gap-0.5">
        <h4 className="capitalize text-xl font-semibold ">{user?.name}</h4>
        {type === "company" ? (
          <p className="text-base">Electronics</p>
        ) : (
          type === "time" &&
          time && <p className="text-base">{formatTimeAgo(time)}</p>
        )}
      </div>
    </div>
  );
}

export default CompanyDetails;
