"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useGetUserSummaryQuery } from "@/store/apis/user.api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface UserSummary {
  userId: string;
  name: string;
  profileImage: string;
  industry: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

function CompanyCard() {
  const [user, setUser] = useState<{ userId: string } | null>(null);
  useEffect(() => {
    const userData = localStorage?.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData) as { userId: string });
    } else {
      setUser(null);
    }
  }, []);

  const {
    data: userData,
    isLoading,
    error,
  } = useGetUserSummaryQuery(user?.userId || "", {
    skip: !user?.userId,
  });

  if (isLoading) {
    return (
      <div className="main-card !p-4">
        <div className="bg-main-bg rounded-md py-4 px-5 flex-center flex-col w-full">
          <div className="flex items-center gap-4 justify-start w-full ">
            <Skeleton className="!rounded-full !bg-white !h-12 !w-12" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-32 !bg-white" />
              <Skeleton className="h-3 w-24 !bg-white" />
            </div>
          </div>
          <Separator className="w-full h-2 !text-white !bg-white !border-white my-2" />
          <div className="flex items-center gap-4 justify-between w-full">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-center flex-col gap-1">
                <Skeleton className="h-5 w-8 !bg-white" />
                <Skeleton className="h-3 w-12 !bg-white" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error || !userData) {
    return (
      <div className="main-card !p-4">
        <div className="bg-main-bg rounded-md py-4 px-5 text-center">
          <p className="text-white">User data not available</p>
        </div>
      </div>
    );
  }
  return (
    <Link href={`/profile`} className="main-card !p-4">
      <div className="bg-main-bg  rounded-md py-4 px-5 flex-center flex-col w-full">
        <div className="flex items-center gap-4 justify-start w-full">
          <Avatar className="size-10 rounded-full object-cover">
            <AvatarImage
              className="size-10 rounded-full object-cover"
              width={48}
              height={48}
              src={userData.profileImage || ""}
            />
            <AvatarFallback>
              <span className="text-white">{userData.name[0]}</span>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h4 className="capitalize text-base font-semibold ">
              {userData.name}
            </h4>
            <p className="text-xs ">{userData.industry}</p>
          </div>
        </div>
        <Separator className="w-full h-2 ! !bg-white !border-white mt-2" />
        <div className="flex items-center gap-4 justify-between mt-1.5 w-full">
          <div className="flex-center flex-col gap-0.5">
            <span className="text-base font-semibold ">
              {userData.followers_count.toLocaleString()}
            </span>
            <p className="text-sm ">Followers</p>
          </div>
          <div className="flex-center flex-col gap-0.5">
            <span className="text-base font-semibold ">
              {userData.following_count.toLocaleString()}
            </span>
            <p className="text-sm ">Following</p>
          </div>
          <div className="flex-center flex-col gap-0.5">
            <span className="text-base font-semibold ">
              {userData.posts_count.toLocaleString()}
            </span>
            <p className="text-sm ">Posts</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CompanyCard;
// "use client"

// import Image from "next/image";
// import React from "react";
// import { Separator } from "../ui/separator";
// import Link from "next/link";

// function CompanyCard() {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   return (
//     <Link href={"/profile/user33"} className="main-card !p-4">
//       <div className="bg-main-bg rounded-md py-4 px-5 flex-center flex-col w-full">
//         <div className="flex items-center gap-4 justify-start  w-full">
//           <Image
//             src="/images/user-placeholder.png"
//             alt="logo"
//             width={30}
//             className="size-12 rounded-full object-contain"
//             height={30}
//           />
//           <div className=" flex flex-col gap-1">
//             <h4 className="capitalize text-base font-semibold ">
//               {user.name}
//             </h4>
//             <p className="text-xs">Electronics</p>
//           </div>
//         </div>
//         <Separator className="w-full h-2 !text-white !bg-white !border-white mt-2" />
//         <div className="flex items-center gap-4 justify-between mt-1.5  w-full">
//           <div className="flex-center flex-col gap-0.5 ">
//             <span className="text-base font-semibold">20k</span>
//             <p className="text-sm">Followers</p>
//           </div>
//           <div className="flex-center flex-col gap-0.5">
//             <span className="text-base font-semibold">20k</span>
//             <p className="text-sm">Following</p>
//           </div>
//           <div className="flex-center flex-col gap-0.5">
//             <span className="text-base font-semibold">20k</span>
//             <p className="text-sm">Post</p>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default CompanyCard;
