"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { Toggle } from "../ui/toggle";
import Link from "next/link";
import { Post } from "@/store/apis/posts";
import { formatTimeAgo } from "@/utils/time";
import RatePost from "./rate-post";
import PostDetails from "./post-details";
import { PostList } from "./post-list";

export function PostSkeleton() {
  return (
    <article className="main-card py-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
      </div>
      <div className="mt-4 h-64 bg-gray-200 rounded-xl animate-pulse"></div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="h-9 w-24 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </article>
  );
}

export function TimelineItem({ post }: { post: Post }) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [rateOpen, setRateOpen] = React.useState<boolean>(false);
  const [isListOpen, setIsListOpen] = React.useState<boolean>(false);
  return (
    <article className="main-card py-6 mb-4">
      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-2 justify-start">
          <Image
            src={`${post.user?.profileImage ?? "/images/user-placeholder.png"}`}
            alt="logo"
            width={24}
            className="size-14 rounded-full object-contain"
            height={24}
          />
          <div className="flex items-start justify-start flex-col gap-0.5">
            <h4 className="capitalize text-xl font-semibold ">
              <Link href={`/profile/${post.userId}`}>{post.user.name}</Link>
            </h4>
            <p className="text-base">{formatTimeAgo(post.createdAt)}</p>
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
        <p className="text-base line-clamp-2">{post.content ?? ""}</p>
        {post.images.length > 0 && (
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
}
