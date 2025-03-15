import Image from "next/image";
import React from "react";
import { Separator } from "../ui/separator";

function CompanyCard() {
  return (
    <div className="main-card">
      <div className="bg-main-bg rounded-md py-4 px-5 flex-center flex-col w-full">
        <div className="flex items-center gap-4 justify-start  w-full">
        
          <Image
            src="/images/user-placeholder.png"
            alt="logo"
            width={30}
            className="size-12 rounded-full object-contain"
            height={30}
          />
          <div className=" flex flex-col gap-1">
            <h4 className="capitalize text-base font-semibold ">Company Name</h4>
            <p className="text-xs">Electronics</p>
          </div>
        </div>
        <Separator className="w-full h-2 !text-white !bg-white !border-white mt-2" />
        <div className="flex items-center gap-4 justify-between mt-1.5  w-full">
          <div className="flex-center flex-col gap-0.5 ">
            <span className="text-base font-semibold">20k</span>
            <p className="text-sm">Followers</p>
          </div>
          <div className="flex-center flex-col gap-0.5">
            <span className="text-base font-semibold">20k</span>
            <p className="text-sm">Following</p>
          </div>
          <div className="flex-center flex-col gap-0.5">
            <span className="text-base font-semibold">20k</span>
            <p className="text-sm">Post</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyCard;
