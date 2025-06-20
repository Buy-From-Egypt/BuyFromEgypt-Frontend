"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import Image from "next/image";
import React from "react";
import CreatePost from "../posts/create-post";

const NewItemFormSchema = z.object({
  title: z.string(),
});
type NewItemFormSchema = z.infer<typeof NewItemFormSchema>;
export function NewPostSkeleton() {
  return (
    <div className="main-card mb-4">
      <div className="flex items-start justify-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-full">
          <div className="h-10 bg-gray-200 rounded-full w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function NewTimelineItem() {
  const [open, setOpen] = React.useState<boolean>(false);
  const form = useForm<NewItemFormSchema>({
    resolver: zodResolver(NewItemFormSchema),
    defaultValues: {
      title: "",
    },
  });
  function onSubmit(data: NewItemFormSchema) {
    console.log(data);
  }
  return (
    <div className="main-card">
      <div className="flex items-start justify-center gap-4">
        <Image
          src="/images/user-placeholder.png"
          alt="logo"
          width={24}
          className="size-10 rounded-full object-contain"
          height={24}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-center justify-start gap-1"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="What are you selling ?"
                      className="flex-1 border-0 shadow-none bg-main-bg h-10 rounded-full"
                      {...field}
                      onClick={() => setOpen(true)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <CreatePost is_open={open} onOpenChange={setOpen} />
    </div>
  );
}
