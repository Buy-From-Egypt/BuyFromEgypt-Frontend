"use client";
import React, { useCallback, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import { DoubleSlider } from "../ui/double-slider";
import { Input } from "../ui/input";
import { StarRating } from "../ui/star-rating";
import { Button } from "../ui/button";
import { useGetCategoriesQuery } from "@/store/apis/category";

interface Category {
  categoryId: string;
  name: string;
  // Add other fields as needed
};
import { useRouter } from "next/navigation";
const ProductsFiltrationFormSchema = z.object({
  categoryId: z.string().optional(),
  // freeShipping: z.boolean().optional().optional(),
  available: z.boolean().optional(),
  rate: z.string().optional(),
  price: z.object({
    from: z.number().optional(),
    to: z.number().optional(),
  }),
});
type ProductsFiltrationFormType = z.infer<typeof ProductsFiltrationFormSchema>;
function buildQueryParams(data: ProductsFiltrationFormType): string {
  const params = new URLSearchParams();

  if (data.categoryId) params.set("categoryId", data.categoryId);
  // if (data.freeShipping)
  //   params.set("freeShipping", data.freeShipping.toString());
  if (data.available) params.set("available", data.available.toString());
  if (data.rate) params.set("rate", data.rate);

  if (data.price?.from !== undefined)
    params.set("minPrice", String(data.price.from));
  if (data.price?.to !== undefined)
    params.set("maxPrice", String(data.price.to));

  return params.toString();
}

function ProductsFiltration() {
  const router = useRouter();
  const { data: industryOptions } = useGetCategoriesQuery({
    refetchOnMountOrArgChange: true,
  });

  const [value, setValue] = useState([1000, 10000]);

  const form = useForm<ProductsFiltrationFormType>({
    resolver: zodResolver(ProductsFiltrationFormSchema),
    defaultValues: {
      categoryId: "",
      // freeShipping: false,
      available: false,
      rate: "",
      price: {
        from: 100,
        to: 10000,
      },
    },
  });
  const resetParams = useCallback(() => {
    const params = new URLSearchParams();
    window.history.pushState(null, "", `?${params.toString()}`);
  }, []);
  function onSubmit(data: ProductsFiltrationFormType) {
    const queryString = buildQueryParams(data);
    router.push(`?${queryString}`);
  }
  return (
    <div className="main-card !p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Accordion defaultValue="item-1" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex justify-between gap-4 items-center !text-lg !font-semibold !leading-relaxed cursor-pointer !py-0">
                Industry
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="mt-4 px-2 flex flex-col space-y-2"
                        >
                            {industryOptions?.map((option: Category, index: number) => {
                            return (
                              <FormItem
                              key={index + 1 - 1}
                              className="flex items-center space-x-3 space-y-0"
                              >
                              <FormControl>
                                <RadioGroupItem
                                className="[&_svg]:size-3 [&_svg]:rounded-full"
                                value={option.categoryId}
                                id={option.categoryId}
                                />
                              </FormControl>
                              <FormLabel
                                className="text-secondary font-normal flex justify-between w-full"
                                htmlFor={option.categoryId}
                              >
                                {option.name}
                                {/* <div className="text-sm text-muted-foreground">
                                ({option.count}) 
                                {/* </div> */}
                              </FormLabel>
                              </FormItem>
                            );
                            })}

    
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* <FormField
            control={form.control}
            name="freeShipping"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between ">
                <div className="space-y-0.5">
                  <FormLabel className="font-semibold text-lg">
                    Free shipping
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between ">
                <div className="space-y-0.5">
                  <FormLabel className="font-semibold text-lg">
                    In-Stock only
                  </FormLabel>
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
          <Accordion type="single" defaultValue="item-2" collapsible>
            <AccordionItem value="item-2" className="!py-0">
              <AccordionTrigger className="flex justify-between gap-4 items-center !text-lg !font-semibold !leading-relaxed cursor-pointer !py-0">
                Price
              </AccordionTrigger>
              <AccordionContent>
                <div className="w-full h-5 flex flex-col items-center justify-center">
                  <DoubleSlider
                    value={value}
                    onValueChange={setValue}
                    aria-label="Dual range slider with output"
                    showTooltip
                    tooltipContent={(val) => `${val} EGP`}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 mt-4">
                  <FormField
                    control={form.control}
                    name="price.from"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="font-normal text-secondary text-sm">
                          From
                        </FormLabel>
                        <FormControl>
                          <Input
                            // type="number"
                            value={value[0]}
                            onChange={(e) => {
                              const newVal = Number(e.target.value);
                              setValue([newVal, value[1]]);
                              field.onChange(newVal);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price.to"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="font-normal text-secondary text-sm">
                          To
                        </FormLabel>
                        <FormControl>
                          <Input
                            // type="number"
                            value={value[1]}
                            onChange={(e) => {
                              const newVal = Number(e.target.value);
                              setValue([value[0], newVal]);
                              field.onChange(newVal);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* <Accordion type="single" collapsible>
            <AccordionItem value="item-3">
              <AccordionTrigger className="flex justify-between gap-4 items-center !text-lg !font-semibold !leading-relaxed cursor-pointer !py-0">
                Ratings
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <StarRating
                          size="md"
                          className="w-full h-10 flex items-center justify-start ml-2"
                          defaultValue={0}
                          onRate={(rating) => field.onChange(String(rating))}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion> */}
          <div className="flex  flex-row gap-4">
            <Button type="submit" className="mt-4 h-9" >
              Filter
            </Button>
            <Button
              type="reset"
              variant={"ghost"}
              className=" mt-4 h-9"
              onClick={() => resetParams()}
            >
              Clear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ProductsFiltration;
