import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center justify-start gap-2">
      <div className="size-12">
        <Image src="/images/logo.png" width={48} height={48} alt="logo" />
      </div>
      <div className="flex items-center justify-center">
        <p className="text-2xl font-semibold text-primary">Buy From Egypt </p>
      </div>
    </div>
  );
}
