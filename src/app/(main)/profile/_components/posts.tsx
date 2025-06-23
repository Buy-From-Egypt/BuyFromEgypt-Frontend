import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileResponse } from "@/store/apis/profile";
import { formatTimeAgo } from "@/utils/time";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ArrowUpRight } from "lucide-react";
import PostDetails from "@/components/posts/post-details";
import RatePost from "@/components/posts/rate-post";
import { PostList } from "@/components/posts/post-list";

interface ImageType {
  id: string;
  url: string;
  postId?: string;
  isPrimary?: boolean;
}

interface PostType {
  postId: string;
  content: string;
  user: {
    userId: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt?: string;
  rating: number;
  reviewCount?: number;
  comments_count: number;
  images: ImageType[];
  [key: string]: any; // Allow additional properties
}

interface PostItemProps {
  post: {
    postId: string;
    content: string;
    user?: {
      userId: string;
      name: string;
      profileImage?: string;
    };
    createdAt: string;
    images?: Array<{
      id: string;
      url: string;
      isPrimary?: boolean;
    }>;
    comments_count?: number;
    rating?: number;
    reviewCount?: number;
    [key: string]: any; // Allow additional properties
  };
}

const PostItem: React.FC<PostItemProps> = ({ post = {} as any }) => {
  // Ensure all required fields have default values
  const safePost = {
    postId: post.postId || "",
    content: post.content || "",
    user: post.user || { userId: "unknown", name: "You", },
    createdAt: post.createdAt || new Date().toISOString(),
    images: Array.isArray(post.images) ? post.images : [],
    comments_count: post.comments_count || 0,
    rating: post.rating || 0,
    reviewCount: post.reviewCount || 0,
    ...post, // Spread any additional properties
  };

  const { user, images } = safePost;
  const [open, setOpen] = React.useState<boolean>(false);
  const [rateOpen, setRateOpen] = React.useState<boolean>(false);
  const [isListOpen, setIsListOpen] = React.useState<boolean>(false);

  return (
    <article className="main-card py-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 justify-start">
          <Image
            src={user.profileImage || "/images/user-placeholder.png"}
            alt={user.name}
            width={56}
            height={56}
            className="size-14 rounded-full object-cover"
          />
          <div className="flex items-start justify-start flex-col gap-0.5">
            <h4 className="capitalize text-xl font-semibold">
              <Link href={`/profile/${user.userId}`}>{user.name}</Link>
            </h4>
            <p className="text-base">{formatTimeAgo(safePost.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Toggle variant={"save"}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="size-6 stroke-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Linear / School / Bookmark">
                <path
                  id="Vector"
                  d="M21 16.0909V11.0975C21 6.80891 21 4.6646 19.682 3.3323C18.364 2 16.2426 2 12 2C7.75736 2 5.63604 2 4.31802 3.3323C3 4.6646 3 6.80891 3 11.0975V16.0909C3 19.1875 3 20.7358 3.73411 21.4123C4.08421 21.735 4.52615 21.9377 4.99692 21.9915C5.98402 22.1045 7.13673 21.0849 9.44216 19.0458C10.4612 18.1445 10.9708 17.6938 11.5603 17.5751C11.8506 17.5166 12.1494 17.5166 12.4397 17.5751C13.0292 17.6938 13.5388 18.1445 14.5578 19.0458C16.8633 21.0849 18.016 22.1045 19.0031 21.9915C19.4739 21.9377 19.9158 21.735 20.2659 21.4123C21 20.7358 21 19.1875 21 16.0909Z"
                  // stroke="#3B3C36"
                  strokeWidth="1.5"
                />
                <path
                  id="Vector_2"
                  d="M15 6H9"
                  // stroke="#3B3C36"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </Toggle>
          <Button
            onClick={() => setIsListOpen(true)}
            className="size-12 bg-transparent shadow-none flex-center hover:bg-transparent p-0"
          >
            <Image
              src="/images/menu-dots.png"
              alt="menu-dots"
              width={24}
              className="size-6 object-contain"
              height={24}
            />
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-base line-clamp-2">{safePost.content}</p>
        {images.length > 0 && (
          <Image
            src={images[0].url}
            alt="Post content"
            width={1000}
            height={800}
            className="h-96 w-full mt-3 rounded-2xl object-cover"
          />
        )}
      </div>
      <div className="flex items-center justify-start gap-2 mt-3">
        <p>{post.comments_count} comments</p>
        <span className="w-2 h-2 bg-primary rounded-full"></span>
        <p>{post.rating} Rate</p>
      </div>
      <div className="mt-4 flex items-center justify-evenly gap-4">
        <Button
          className="flex-center gap-2 cursor-pointer bg-transparent shadow-none border-0 hover:bg-gray-50"
          onClick={() => setRateOpen(true)}
        >
          <Image
            src="/star.png"
            alt="rate"
            width={24}
            className="size-6"
            height={24}
          />
          <p className="text-base text-secondary">Rate</p>
        </Button>
        <div className="flex-center gap-2">
          <Image
            src="/chat-unread.png"
            alt="comment"
            width={24}
            className="size-6"
            height={24}
          />
          <p className="text-base text-secondary">Comment</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="!h-9 rounded-full px-5 py-3"
        >
          Show More <ArrowUpRight />
        </Button>
      </div>
      <PostDetails postId={post.postId} is_open={open} onOpenChange={setOpen} />
      <RatePost
        postId={post.postId}
        open={rateOpen}
        setOpen={setRateOpen}
        rate={"0"}
      />
      <PostList
        isListOpen={isListOpen}
        setIsListOpen={setIsListOpen}
        postId={post.postId}
      />
    </article>
  );
};

const Posts = ({ data }: { data: ProfileResponse }) => {
  // Safely access posts with fallback to empty array
  const posts = Array.isArray(data?.posts) ? data.posts : [];

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No posts available</div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        if (!post) return null;

        // Create a safe post object with all required fields
        const safePost = {
          ...post,
          postId: post.postId || "",
          content: post.content || "",
          user: post.user || { userId: "unknown", name: "Unknown User" },
          createdAt: post.createdAt || new Date().toISOString(),
          images: Array.isArray(post.images) ? post.images : [],
          comments_count: post.comments_count || 0,
          rating: post.rating || 0,
        };

        return (
          <div key={safePost.postId || Math.random().toString(36).substr(2, 9)}>
            <PostItem post={safePost} />
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
