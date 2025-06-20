"use client";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import MultipleSelector, { Option } from "@/components/ui/multi-selector";
import { useUserPreferenceMutation } from "@/store/apis/auth.api";
import { useRouter } from "next/navigation";
// import logo from "@/public/logo.png";

const defaultIndustries = [
  "Agriculture & Food",
  "Petroleum & Energy",
  "Construction & Building Materials",
  "Electronics",
  "Chemicals & Fertilizers",
  "Textiles & Garments",
  "Handicrafts & Furniture",
];
const OPTIONS: Option[] = [
  {
    value: "Agriculture & Food",
    label: "Agriculture & Food",
  },
  {
    value: "Petroleum & Energy",
    label: "Petroleum & Energy",
  },
  {
    value: "Construction & Building Materials",
    label: "Construction & Building Materials",
  },
  {
    value: "Electronics",
    label: "Electronics",
  },
  {
    value: "Chemicals & Fertilizers",
    label: "Chemicals & Fertilizers",
  },
  {
    value: "Textiles & Garments",
    label: "Textiles & Garments",
  },
  {
    value: "Handicrafts & Furniture",
    label: "Handicrafts & Furniture",
  },
];
const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});
const formSchema = z.object({
  industries: z.array(optionSchema).min(1),
  supplierType: z.string().min(1, "Please select a supplier type"),
  orderQuantity: z.string().optional(),
  shippingMethod: z.string().optional(),
  receiveAlerts: z.boolean().default(false),
});

const supplierTypes = [
  { value: "small", label: "Small Businesses" },
  { value: "medium", label: "Medium Enterprises" },
  { value: "large", label: "Large Corporations" },
];

const shippingMethods = [
  { value: "Air Freight", label: "Air Freight" },
  { value: "Sea Freight", label: "Sea Freight" },
  { value: "Road Freight", label: "Road Freight" },
];

function Page() {
  const [userPreference, { isLoading }] = useUserPreferenceMutation();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const justValues = data.industries.map((industry) => industry.value);
      console.log("Form submitted:", data);
      await userPreference({
        industries: justValues,
        supplierType: data.supplierType,
        shippingMethods: data.shippingMethod || "",
        orderQuantity: data.orderQuantity || "",
        receiveAlerts: data.receiveAlerts,
      })
        .unwrap()
        .then((res) => {
          router.push("/auth/sign-in");
        })
        .catch(({ data }) => {
          toast.error(data.message);
        });
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    }
  }

  return (
    <div className="flex gap-4 items-center justify-center h-full">
      <div className="main-card  w-md flex items-center flex-col space-y-6">
        <div className="text-center">
          <div className="self-stretch text-center justify-start text-black text-xl font-normal font-['Manrope']">
            Smart Sourcing Starts Here!
          </div>
          <div className="self-stretch text-center justify-start text-stone-400 text-sm font-normal font-['Manrope'] leading-tight">
            Customize your experience and find the right products
          </div>
        </div>
        <div className="my-2 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* select industries */}
              <FormField
                control={form.control}
                name="industries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Your Industry</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        {...field}
                        defaultOptions={OPTIONS}
                        placeholder="Select or type to add industries..."
                        creatable
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            No results found. Type to add a new industry
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplierType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Preferred Supplier Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supplierTypes.map((supplierType) => (
                          <SelectItem
                            key={supplierType.value}
                            value={supplierType.value}
                          >
                            {supplierType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Quantity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Shipping Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shippingMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiveAlerts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg p-3">
                    <div className="space-y-1 leading-none">
                      <FormLabel>Receive alerts for new products</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" isLoading={isLoading} className="w-full">
                Continue
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Page;
