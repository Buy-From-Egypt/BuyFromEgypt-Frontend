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
import { ArrowUpDown, ChevronDown, Loader, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  useCreateCommentMutation,
  useGetPostCommentsQuery,
  useGetPostIdQuery,
  useSavePostMutation,
} from "@/store/apis/posts";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

const PostDetailsFormSchema = z.object({
  comment: z.string(),
});
type Comment = {
  id: string;
  content: string;
  user: {
    id: string;
    name?: string;
    profileImage?: string;
  };
  createdAt: string;
};

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
  const [createComment, { isLoading: isCommentLoading }] =
    useCreateCommentMutation();
  const { data: post, isLoading } = useGetPostIdQuery({ postId });
  const [savePost, { isLoading: isSaveLoading }] = useSavePostMutation();
  const {
    data: commentsResponse,
    isLoading: isCommentsLoading,
    refetch: refetchComments,
  } = useGetPostCommentsQuery({ postId });
  const comments: Comment[] = Array.isArray(commentsResponse)
    ? commentsResponse
    : [];
  const form = useForm<PostDetailsFormType>({
    resolver: zodResolver(PostDetailsFormSchema),
    defaultValues: {
      comment: "",
    },
  });
  const handleSavePost = async () => {
    await savePost({ postId })
      .then(() => {
        toast.success("Post saved successfully");
      })
      .catch((error) => {
        toast.error("Failed to save post");
      });
  };
  async function onSubmit(data: PostDetailsFormType) {
    if (!data.comment.trim()) return;

    try {
      await createComment({
        postId,
        content: data.comment,
      }).unwrap();

      // Clear the form and refresh comments
      form.reset({ comment: "" });
      refetchComments();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
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
                <Toggle onClick={handleSavePost}>
                  {/* <div className="size-12 bg-main-bg rounded-full flex-center"> */}
                  {isSaveLoading ? (
                    <Loader className="size-6 rounded-full" />
                  ) : (
                    <Image
                      src="/images/saves.png"
                      alt="saves"
                      width={24}
                      className="size-6"
                      height={24}
                    />
                  )}

                  {/* </div> */}
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
            {isCommentsLoading ? (
              <div className="mt-4">Loading comments...</div>
            ) : (
              <div className="space-y-4 mt-4 max-h-96 overflow-y-auto pr-2">
                {(comments as Comment[]).length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  (comments as Comment[]).map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.user?.profileImage} />
                        <AvatarFallback>
                          {comment.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {comment.user?.name || "Anonymous"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="mb-36" />
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
                    <Button
                      type="submit"
                      className="w-32 rounded-full"
                      disabled={isCommentLoading}
                    >
                      {isCommentLoading ? "Sending..." : "Send"}
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
