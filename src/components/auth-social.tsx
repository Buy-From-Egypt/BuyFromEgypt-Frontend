import Image from "next/image";
import { Separator } from "./ui/separator";

export default function AuthSocial() {
  return (
    <div>
      <div className="flex-center gap-2 w-[400px] mt-4">
        <Separator className="flex-1 text-[#A8A99C] " />
        <p className=" capitalize">Or Continue With</p>
        <Separator className="flex-1 text-[#A8A99C] " />
      </div>
      <div className="flex-center gap-4 mt-4 *:cursor-pointer">
        <div className="flex-center size-10 rounded-full bg-main-bg">
          <Image
            src={"/images/google.png"}
            width={24}
            height={24}
            className="object-contain"
            alt="google-icon"
          />
        </div>
        <div className="flex-center size-10 rounded-full bg-main-bg">
          <Image
            src={"/images/facebook.png"}
            width={24}
            height={24}
            className="object-contain"
            alt="facebook-icon"
          />
        </div>
        <div className="flex-center size-10 rounded-full bg-main-bg">
          <Image
            src={"/images/apple.png"}
            width={24}
            height={24}
            className="object-contain"
            alt="apple-icon"
          />
        </div>
      </div>
    </div>
  );
}
