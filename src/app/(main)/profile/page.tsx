"use client";
import Info from "@/components/profile/info";
import ProfileTabs from "./_components/profile-tabs";
import { useGetProfileQuery } from "@/store/apis/profile";

export default function Page() {
  const { data, isLoading } = useGetProfileQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  return (
    <div className="w-full flex flex-col">
      <Info
        cover="/cover.jpg"
        slug={"sm"}
        profile={data?.profileImage || "/s-logo.png"}
        name={data?.name}
        description={data?.about || ""}
        followers={data?.followersCount || 0}
        following={data?.followingCount || 0}
        posts={data?.postsCount || 0}
      />
      <ProfileTabs data={data} />
    </div>
  );
}
