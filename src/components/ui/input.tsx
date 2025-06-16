import * as React from "react";

import { cn } from "@/lib/utils";
// import Image from "next/image";

interface InputProps extends React.ComponentProps<"input"> {
  main_icon?: React.ReactNode;
  second_icon?: React.ReactNode;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, main_icon, second_icon, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type ?? "text"}
          data-slot="input"
          className={cn(
            "w-full",
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base font-normal shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none focus-visible:ring-0",
            className,
            main_icon ? "pl-12" : "",
            second_icon ? "pr-12" : ""
          )}
          ref={ref}
          {...props}
        />

        {main_icon && (
          <div
            className={cn("absolute inset-y-0 flex items-center left-0 pl-3")}
          >
            {main_icon}
          </div>
        )}
        {second_icon && (
          <div
            className={cn(
              "absolute inset-y-0 flex items-center",
              "right-0 pr-3"
            )}
          >
            {second_icon}
          </div>
        )}
      </div>
    );
  }
);

// function FormInput({
//   className,
//   main_icon,
//   sec_icon,
//   ...props
// }: Readonly<FormInputProps>) {
//   return (
//     <div className="relative">
//       <input
//         type={type}
//         className={cn(
//           "flex h-11 w-full text-base font-medium rounded-md border-2 border-input bg-transparent px-3 text-text-input transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed active:border-primary focus-visible:border-primary focus-visible:outline-none disabled:border-slate-200 disabled:focus-visible:border-slate-200 disabled:active:border-slate-200 disabled:opacity-50 disabled:bg-gray-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />

//       {main_icon && (
//         <div className={cn("absolute inset-y-0 flex items-center")}>
//           {main_icon}
//         </div>
//       )}
//       {secondIcon && (
//         <div
//           className={cn(
//             "absolute inset-y-0 flex items-center",
//             secondIconPosition
//           )}
//         >
//           {secondIcon}
//         </div>
//       )}
//     </div>
//     // <div className="px-2 py-1.5 relative flex items-center justify-start gap-2 min-w-[300px] rounded-lg  border border-black bg-transparent  focus:border-main-bg focus-within:border-ring-main-bg  *:focus-within:outline-none  has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
//     //   {main_icon && (
//     //     <Image
//     //       src={main_icon}
//     //       width={26}
//     //       height={26}
//     //       className="ml-2"
//     //       alt="main-icon"
//     //     />
//     //   )}

//     //   <div className="relative w-full">
//     //     <input
//     //       data-slot="form-input"
//     //       className={cn(
//     //         "flex h-9 w-full bg-transparent px-3   text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none",
//     //         className
//     //       )}
//     //       {...props}
//     //     />
//     //   </div>
//     //   {sec_icon || null}
//     // </div>
//   );
// }

export { Input };
