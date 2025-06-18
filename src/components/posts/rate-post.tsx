"use client";
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { StarRating } from "../ui/star-rating";
import { FormControl, FormField, FormItem, Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRatePostMutation } from "@/store/apis/posts";
import { toast } from "sonner";

const RatePostSchema = z.object({
  rate: z.string().min(0).max(5),
});

type RatePostType = z.infer<typeof RatePostSchema>;

function RatePost({
  postId,
  open,
  setOpen,
  rate,
}: {
  postId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  rate: string;
}) {
  const [addRate, { isLoading }] = useRatePostMutation();
  const form = useForm<RatePostType>({
    resolver: zodResolver(RatePostSchema),
    defaultValues: {
      rate: rate,
    },
  });
  const onSubmit = async (data: RatePostType) => {
    const value = Number(data.rate);
    console.log(data);
    await addRate({
      postId,
      value,
    })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white  p-0">
        <DialogHeader className="text-start space-y-3 bg-main-bg rounded-t-lg p-4">
          <DialogTitle className="text-start font-normal">Rate</DialogTitle>
        </DialogHeader>
        <div className="px-4 pt-4 flex flex-col items-start justify-between">
          <h3 className="text-xl font-medium">
            Your Opinion Matters! Rate This Post
          </h3>
          <p className="text-lg text-secondary">
            Help others by rating this post—your feedback counts!
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 px-4 py-4"
          >
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <StarRating
                      size="lg"
                      className="w-full flex items-center justify-center"
                      defaultValue={0}
                      onRate={(rating) => field.onChange(String(rating))}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              isLoading={isLoading}
              type="submit"
              className="w-full rounded-full"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default RatePost;
