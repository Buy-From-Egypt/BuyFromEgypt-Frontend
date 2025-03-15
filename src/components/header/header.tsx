"use client";
import Image from "next/image";
import { Logo } from "../logo";
import HeaderForm from "./form";

export default function Header() {
  return (
    <header className="h-20 flex-center p-2 bg-white fixed top-0 left-0 right-0 w-full">
      <div className="container ">
        <div className="flex items-center justify-between gap-3">
          <div className="w-1/4 ">
            <Logo />
          </div>
          <div className="w-1/2">
            <HeaderForm />
          </div>
          <div className="w-1/4 flex-center !justify-end gap-2">
            <div className="bg-main-bg rounded-full h-12 py-1 px-3 flex-center gap-4">
              <Image
                src="/images/location.png"
                width={24}
                height={24}
                alt="google-icon"
              />
              <Image
                src="/images/flag-1.png"
                width={24}
                height={24}
                alt="flag-icon"
              />
            </div>
            <div className="size-12 border-2 border-main-bg rounded-full flex-center gap-2">
              <Image
                src="/images/bell.png"
                width={24}
                height={24}
                alt="bell-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
