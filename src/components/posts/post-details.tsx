"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import CompanyDetails from "../company-details";
import { Toggle } from "../ui/toggle";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { ArrowUpDown, ChevronDown, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useGetPostIdQuery } from "@/store/apis/posts";

const PostDetailsFormSchema = z.object({
  comment: z.string(),
});
type PostDetailsFormType = z.infer<typeof PostDetailsFormSchema>;
const PostDetails = ({
  postId,
  is_open,
  onOpenChange,
}: Readonly<{
  postId: string;
  is_open: boolean;
  onOpenChange: (open: boolean) => void;
}>) => {
  const { data: post, isLoading } = useGetPostIdQuery({ postId });
  const form = useForm<PostDetailsFormType>({
    resolver: zodResolver(PostDetailsFormSchema),
    defaultValues: {
      comment: "",
    },
  });
  function onSubmit(data: PostDetailsFormType) {
    console.log(data);
  }
  return (
    <Dialog open={is_open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white  p-0 !w-2xl">
        <ScrollArea className="w-full h-[800px] relative">
          <DialogHeader className="fixed top-0 w-full text-start space-y-3 bg-main-bg rounded-t-lg p-4">
            <DialogTitle className="text-start font-normal">
              Post Details
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 my-4 mt-16">
            <div className=" pt-0 flex items-center justify-between">
              <CompanyDetails
                user={post?.user}
                type="time"
                time={post?.createdAt}
              />
              <div className="flex items-center justify-end gap-2">
                <Toggle>
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
            <div className="mt-3 ">
              <p className="text-base">{post?.content}</p>
              {post?.images && post.images.length > 0 && (
                <Image
                  src={post.images[0].url}
                  alt="card-image"
                  width={1000}
                  className="h-96 w-full mt-3 rounded-2xl object-cover"
                  height={800}
                />
              )}
            </div>
            <div className="flex items-center justify-start gap-2 mt-3">
              {/* <p>{post?.comments_count} comments</p> */}
              {/* <span className="w-2 h-2 bg-primary rounded-full" /> */}
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />{" "}
              {post?.rating}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                Comments
                <Badge className="bg-primary text-white">
                  {post?.comments_count}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} />
                Most recent
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="flex items-start mt-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 ml-2">
                <div className="flex items-center gap-2">
                  Mohamed Talaat
                  <span className="text-xs text-neutral-400 font-bold">
                    5 hours ago
                  </span>
                </div>
                <div className="flex items-center justify-start gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Star className="w-4 h-4 fill-neutral-700" />
                </div>
              </div>
            </div>
            <div className="mt-4 mb-36">
              <p className="text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>
            <div className="mt-4 bg-zinc-100 rounded-xl py-2 px-2 absolute bottom-2 left-0 right-0  mx-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full flex flex-col items-center justify-start gap-1"
                >
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            placeholder="Add a comment..."
                            className="resize-none w-full border-0 shadow-none bg-transparent outline-none focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex items-center justify-between gap-4">
                    <div className="flex items-center justify-start gap-4">
                      <div className="flex items-center gap-4 justify-start">
                        <Image
                          src="/images/gallery.png"
                          alt="logo"
                          width={24}
                          className="size-6"
                          height={24}
                        />
                      </div>
                      <div className="flex items-center gap-4 justify-start">
                        <Image
                          src="/images/video.png"
                          alt="logo"
                          width={24}
                          className="size-6"
                          height={24}
                        />
                      </div>
                      <div className="flex items-center gap-4 justify-start">
                        <Image
                          src="/images/link.png"
                          alt="logo"
                          width={24}
                          className="size-6  "
                          height={24}
                        />
                      </div>
                      <div className="flex items-center gap-4 justify-start">
                        <Image
                          src="/images/event.png"
                          alt="logo"
                          width={24}
                          className="size-6  "
                          height={24}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-32 rounded-full">
                      Send
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default PostDetails;
