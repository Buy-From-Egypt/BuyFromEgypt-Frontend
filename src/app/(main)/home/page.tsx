"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { NewPostSkeleton, NewTimelineItem } from "@/components/posts/new-post";
import { PostSkeleton, TimelineItem } from "@/components/posts/post";
import { useGetPostsQuery } from "@/store/apis/posts";

export default function Page() {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const { data, isLoading, isFetching } = useGetPostsQuery({ page, limit: 10 });
  const loader = useRef(null);

  // Merge new posts with existing ones when data changes
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllPosts(data.data);
      } else {
        setAllPosts(prev => [...prev, ...data.data]);
      }
    }
  }, [data, page]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && data?.meta?.NextPage) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [isFetching, data?.meta?.NextPage]);

  // Reset posts when component unmounts
  useEffect(() => {
    return () => setAllPosts([]);
  }, []);
  if (isLoading) {
    return (
      <>
        <NewPostSkeleton />
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <PostSkeleton key={i} />
          ))}
      </>
    );
  }
  return (
    <div className="flex flex-col gap-4 mb-10">
      <NewTimelineItem />
      {allPosts.map((post, index) => (
        <TimelineItem 
          key={`${post.postId}-${post.updatedAt || ''}-${index}`} 
          post={post} 
        />
      ))}
      {(isLoading || isFetching) && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}
      <div ref={loader} className="h-1" />
    </div>
  );
}
