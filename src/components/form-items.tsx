"use client";

import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { FormInput, Input } from "./ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
export function ControlledFormField() {
  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <FormInput />
            {/* <Input placeholder="shadcn" {...field} /> */}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
