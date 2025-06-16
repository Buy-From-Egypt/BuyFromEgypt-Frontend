"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CompanyDetails from "./company-details";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { MultiFileInput } from "./ui/multi-files-input";
import { Input } from "./ui/input";
import { useCreatePostMutation } from "@/store/apis/posts";
import { toast } from "sonner";
import { FileInput } from "./ui/input-file";
interface Props {
  is_open: boolean;
  onOpenChange: (open: boolean) => void;
}
const FormSchema = z.object({
  content: z.string(),
  title: z.string(),
  // images: z.instanceof(File).nullable(),
  images: z.array(z.instanceof(File)).nullable(),
});
type FormValues = z.infer<typeof FormSchema>;
function CreatePost({ is_open, onOpenChange }: Readonly<Props>) {
  const [newPost, { isLoading }] = useCreatePostMutation();
  const [uploadOpen, setUploadOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      images: null,
    },
  });
  async function onSubmit(data: FormValues) {
    // console.log(data);
    await newPost(data)
      .unwrap()
      .then((res) => {
        toast.success("Post created successfully");
        form.reset();
        onOpenChange(false);
      })
      .catch(({ data }) => {
        toast.error(data.message);
      });
  }
  return (
    <Dialog open={is_open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white  p-0">
        <DialogHeader className="text-start space-y-3 bg-main-bg rounded-t-lg p-4">
          <DialogTitle className="text-start font-normal">
            Create Post
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 pt-0 flex items-center justify-start">
          <CompanyDetails />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2 px-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="your post title here ...."
                      className=" text-secondary border-0 ring-0 focus-visible:ring-0 w-full shadow-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Launching a new product? Closing a big deal? Let everyone know!"
                      className="resize-none min-h-32 text-secondary border-0 ring-0 focus-visible:ring-0 w-full shadow-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {/* <FileInput
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                        /> */}
                        <MultiFileInput
                          value={field.value}
                          onChange={field.onChange}
                          maxFiles={5}
                          accept="image/*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogContent>
            </Dialog>
            <div className="flex items-center justify-between gap-2 p-4 border border-main-bg rounded-md">
              <div>Add to your post</div>

              <div className="flex items-center justify-start gap-4 ">
                <div className="flex items-center gap-4 justify-start">
                  <Image
                    src="/images/gallery.png"
                    alt="logo"
                    onClick={() => setUploadOpen(true)}
                    width={24}
                    className="size-6 cursor-pointer"
                    height={24}
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              isLoading={isLoading}
              variant={"default"}
              className="w-full h-10 rounded-full"
            >
              Post
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
