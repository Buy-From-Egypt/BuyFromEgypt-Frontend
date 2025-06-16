import { Logo } from "@/components/logo";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <section className="bg-main-bg flex flex-col items-center justify-center h-svh">
      {/* <div className=" absolute top-2 left-1/2 transform -translate-x-1/2 mt-10"> */}
      {/* <div className="mt-10">
        <Logo />
      </div> */}
      {children}
    </section>
  );
}
