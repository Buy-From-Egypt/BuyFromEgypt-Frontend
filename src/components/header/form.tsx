import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
const formSchema = z.object({
  search: z
    .string()
    .min(1, { message: "Search must be at least 2 characters." }),
  type: z.enum(["product-1", "product-2", "product-3"]),
});
type FormSchema = z.infer<typeof formSchema>;
export default function HeaderForm() {
  const form = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      type: "product-1",
    },
  });
  function onSubmit(data: FormSchema) {
    console.log(data);
  }
  return (
    <div className="w-full flex-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex items-center justify-between gap-3 h-12 px-2 border-2 border-main-bg rounded-full"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="border-0 shadow-none bg-transparent outline-none focus-visible:ring-0"
                    placeholder="What you are looking for ?"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[120px] cursor-pointer border-0 shadow-none bg-transparent">
                      <SelectValue placeholder="product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="product-1">product-1</SelectItem>
                    <SelectItem value="product-2">product-2</SelectItem>
                    <SelectItem value="product-3">product-3</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="size-8 p-0.5 bg-main-bg hover:bg-main-bg/80 rounded-full flex-center"
          >
            <Image
              src="/images/search.png"
              width={20}
              height={20}
              alt="search-icon"
              className="object-contain"
            />
          </Button>
        </form>
      </Form>
    </div>
  );
}
