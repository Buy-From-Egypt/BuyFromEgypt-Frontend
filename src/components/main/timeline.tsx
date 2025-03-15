"use client";
import Image from "next/image";
import React from "react";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Toggle } from "../ui/toggle";

function Timeline() {
  return (
    <div className="flex flex-col gap-4">
      <NewTimelineItem />
      <TimelineItem />
      <TimelineItem />
      <TimelineItem />
    </div>
  );
}

export default Timeline;

const NewItemFormSchema = z.object({
  title: z.string(),
});
type NewItemFormSchema = z.infer<typeof NewItemFormSchema>;
function NewTimelineItem() {
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
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="flex-0 rounded-full size-10">
              <ArrowRight className="size-5" />
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex items-center gap-4 justify-between mt-6">
        <div className="flex items-center justify-start gap-4">
          <div className="flex items-center gap-4 justify-start">
            <Image
              src="/images/gallery.png"
              alt="logo"
              width={24}
              className="size-6"
              height={24}
            />
            <p className="text-sm">Image</p>
          </div>
          <div className="flex items-center gap-4 justify-start">
            <Image
              src="/images/video.png"
              alt="logo"
              width={24}
              className="size-6"
              height={24}
            />
            <p className="text-sm">Video</p>
          </div>
          <div className="flex items-center gap-4 justify-start">
            <Image
              src="/images/link.png"
              alt="logo"
              width={24}
              className="size-6  "
              height={24}
            />
            <p className="text-sm">Attachment</p>
          </div>
          <div className="flex items-center gap-4 justify-start">
            <Image
              src="/images/event.png"
              alt="logo"
              width={24}
              className="size-6  "
              height={24}
            />
            <p className="text-sm">Event</p>
          </div>
        </div>
        <div>
          <Select defaultValue="private">
            <SelectTrigger className="w-[100px] cursor-pointer border-0 shadow-none bg-transparent">
              <SelectValue placeholder="private" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="public">public</SelectItem>
              <SelectItem value="private">private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
function TimelineItem() {
  return (
    <article className="main-card py-6 mb-4">
      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-2 justify-start">
          <Image
            src={"/images/user-placeholder.png"}
            alt="logo"
            width={24}
            className="size-14 rounded-full object-contain"
            height={24}
          />
          <div className="flex items-start justify-start flex-col gap-0.5">
            <h4 className="capitalize text-xl font-semibold ">Company Name</h4>
            <p className="text-base">2 days ago</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Toggle variant={"circle"}>
            <Image
              src="/images/saves.png"
              alt="saves"
              width={24}
              className="size-6"
              height={24}
            />
          </Toggle>
          <div className="size-12 bg-main-bg rounded-full flex-center">
            <Image
              src="/images/menu-dots.png"
              alt="menu-dots"
              width={24}
              className="size-6"
              height={24}
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, magnam
          quos. Quae, magnam quos. Quae, magnam quos. Quae, magnam quos. Quae,
          magnam quos. Quae, magnam quos. Quae, magnam quos. Quae, magnam quos.
        </p>
        <Image
          src={"/images/card-image.png"}
          alt="card-image"
          width={1000}
          className="h-96 w-full mt-3 rounded-2xl object-cover"
          height={800}
        />
      </div>
      <div className="mt-4 flex-center gap-4">
        <div className="flex-1 rounded-md  h-12 flex-center bg-main-bg hover:bg-main-bg/80 cursor-pointer gap-3">
          <Image
            src="/images/star.png"
            alt="rate"
            width={24}
            className="size-5"
            height={24}
          />
          <p className="text-base text-secondary">Rate</p>
          <p className="text-base font-semibold text-black">50</p>
        </div>
        <div className="flex-1 rounded-md  h-12 flex-center bg-main-bg hover:bg-main-bg/80 cursor-pointer gap-3">
          <Image
            src="/images/comment.png"
            alt="comment"
            width={24}
            className="size-5"
            height={24}
          />
          <p className="text-base text-secondary">Comment</p>
          <p className="text-base font-semibold text-black ">50</p>
        </div>
      </div>
    </article>
  );
}
