"use client";

import { useState, useEffect, useRef } from "react";
import { NewPostSkeleton, NewTimelineItem } from "@/components/posts/new-post";
import { PostSkeleton, TimelineItem } from "@/components/posts/post";
import { useGetPostsQuery, Post } from "@/store/apis/posts";
import { useGetPostRecommendationsByUserIdQuery } from "@/store/apis/recommendations";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("all-posts");
  const loader = useRef(null);

  // API Queries
  const { data, isLoading, isFetching } = useGetPostsQuery(
    { page, limit: 10 },
    { skip: activeTab !== "all-posts" }
  );

  const {
    data: recommendationsData,
    isLoading: isLoadingRecommendations,
    error: recommendationsError,
  } = useGetPostRecommendationsByUserIdQuery(
    { userId: user?.userId || "", num_recommendations: 20 },
    { skip: !user?.userId || activeTab !== "ai-suggestions" }
  );

  // Merge new posts with existing ones when data changes
  useEffect(() => {
    if (data?.data && activeTab === "all-posts") {
      if (page === 1) {
        setAllPosts(data.data);
      } else {
        setAllPosts((prev) => [...prev, ...data.data]);
      }
    }
  }, [data, page, activeTab]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (activeTab !== "all-posts") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && data?.meta?.NextPage) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [isFetching, data?.meta?.NextPage, activeTab]);

  // Reset posts when tab changes
  useEffect(() => {
    if (activeTab === "all-posts") {
      setPage(1);
      setAllPosts([]);
    }
  }, [activeTab]);

  // Helper functions to render content
  const renderAllPostsContent = () => (
    <div className="flex flex-col gap-4 mb-10">
      {isLoading && page === 1 ? (
        <>
          <NewPostSkeleton />
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <PostSkeleton key={i} />
            ))}
        </>
      ) : (
        <>
          {allPosts.map((post, index) => (
            <TimelineItem
              key={`${post.postId}-${post.updatedAt || ""}-${index}`}
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
        </>
      )}
      <div ref={loader} className="h-1" />
    </div>
  );

  const renderAISuggestionsContent = () => (
    <div className="flex flex-col gap-4 mb-10">
      {isLoadingRecommendations ? (
        <>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <PostSkeleton key={`rec-skeleton-${i}`} />
            ))}
        </>
      ) : recommendationsError ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg">
          <p className="text-lg font-medium text-muted-foreground mb-2">
            Failed to load recommendations
          </p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Please make sure you have set your preferences in your profile.
          </p>
        </div>
      ) : recommendationsData?.data?.recommendations &&
        Array.isArray(recommendationsData.data.recommendations) &&
        recommendationsData.data.recommendations.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>AI Recommendations:</strong>{" "}
              {recommendationsData?.data?.recommendation_reason ||
                "Personalized content for you"}
            </p>
            {recommendationsData?.data?.used_preferences && (
              <p className="text-xs text-blue-600 mt-2">
                Based on your interests in:{" "}
                {recommendationsData.data.used_preferences.selected_industries?.join(
                  ", "
                ) || "your preferences"}
              </p>
            )}
          </div>
          {(recommendationsData.data.recommendations as Post[]).map(
            (post: Post, index: number) => (
              <TimelineItem key={`rec-${post.postId}-${index}`} post={post} />
            )
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg">
          <p className="text-lg font-medium text-muted-foreground mb-2">
            No recommendations available
          </p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Set your preferences in your profile to get personalized post
            recommendations.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* New Post Form */}
      <NewTimelineItem />

      {/* Tabs for All Posts vs AI Suggestions */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full p-0 h-auto bg-transparent rounded-full border-0 flex gap-2">
          <TabsTrigger
            value="all-posts"
            className="flex-1 px-8 py-3 rounded-full text-gray-600 font-medium text-sm bg-transparent border-0 data-[state=active]:text-white data-[state=active]:bg-gray-800 transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-gray-800"
          >
            All Posts
          </TabsTrigger>
          {user && (
            <TabsTrigger
              value="ai-suggestions"
              className="flex-1 px-8 py-3 rounded-full text-gray-600 font-medium text-sm bg-transparent border-0 data-[state=active]:text-white data-[state=active]:bg-gray-800 transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-gray-800"
            >
              AI Suggestions
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all-posts" className="space-y-6">
          {renderAllPostsContent()}
        </TabsContent>
        <TabsContent value="ai-suggestions" className="space-y-6">
          {renderAISuggestionsContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
