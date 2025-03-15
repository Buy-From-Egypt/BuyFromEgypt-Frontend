"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface VerticalNavProps {}
interface Nav {
  name: string;
  icon: string;
  is_active: boolean;
  path: string;
}
function VerticalNav() {
  const pathname = usePathname();
  const nav: Nav[] = [
    {
      name: "Home",
      icon: "home.png",
      is_active: pathname === "/home",
      path: "/home",
    },
    {
      name: "Marketplace",
      icon: "market.png",
      is_active: pathname === "/marketplace",
      path: "/marketplace",
    },
    {
      name: "Orders and Tracking",
      icon: "order.png",
      is_active: pathname === "/order-tracking",
      path: "/order-tracking",
    },
    {
      name: "Saves",
      icon: "saves.png",
      is_active: pathname === "/saves",
      path: "/saves",
    },
    {
      name: "Help",
      icon: "help.png",
      is_active: pathname === "/help",
      path: "/help",
    },
  ];
  return (
    <div className="main-card">
      <div className=" rounded-md flex-center flex-col w-full">
        {nav.map((item, index) => (
          <Link
            href={item.path}
            className={cn(
              "flex items-center bg-main-bg mb-3 gap-4 justify-start cursor-pointer  w-full py-4 px-2 rounded-md",
              item.is_active && "text-white bg-primary hover:bg-primary/80"
            )}
            key={index + 1 - 1}
          >
            <img
              src={`/images/${item.icon}`}
              alt="logo"
              width={24}
              //   className="size-12"
              height={24}
            />
            <h4 className="capitalize text-base font-semibold ">{item.name}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default VerticalNav;
