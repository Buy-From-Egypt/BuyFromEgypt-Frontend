import Image from "next/image";
import SignUpForm from "./form";

export default function Page() {
  return (
     <section className="bg-white flex items-center justify-center h-svh">
          <div className="flex-1 h-full flex items-center justify-center">
            <SignUpForm />
          </div>
          <div className="flex-1 h-full flex items-center justify-center">
            <Image
            src={"/images/carousel.png"}
            width={1000}
            height={900}
            className="w-full h-full object-cover"
            alt="carousel.png"
            />
          </div>
          </section>
  )
}
