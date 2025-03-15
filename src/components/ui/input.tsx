import * as React from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none focus-visible:ring-0",
        className
      )}
      {...props}
    />
  );
}
interface FormInputProps extends React.ComponentProps<"input"> {
  label: string;
  main_icon: string;
  sec_icon?: React.ReactNode;
}

function FormInput({
  className,
  main_icon,
  sec_icon,
  label,
  ...props
}: Readonly<FormInputProps>) {
  const id = React.useId();
  return (
    <div className="px-2 relative flex items-center justify-start gap-2 min-w-[300px] rounded-lg  border-2 border-main-bg bg-transparent  focus:border-main-bg focus-within:border-ring-main-bg  *:focus-within:outline-none  has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
      <Image src={main_icon} width={24} height={24} alt="main-icon" />
      <div className="relative w-full">
        <label
          htmlFor={id}
          className="block px-2 pt-2 text-xs font-medium text-foreground"
        >
          {label}
        </label>
        <input
          data-slot="form-input"
          className={cn(
            "flex h-9 w-full bg-transparent px-3 pb-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none",
            className
          )}
          {...props}
        />
      </div>
      {sec_icon || null}
    </div>
  );
}

export { Input, FormInput };
