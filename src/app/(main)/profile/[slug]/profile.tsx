import React from "react";
import Info from "./_components/info";
import ProfileTabs from "./_components/profile-tabs";

function Profile({ slug }: { slug: string }) {
  return (
    <div className="w-full flex flex-col">
      <Info
        cover="/cover.jpg"
        slug={"sm"}
        profile="/s-logo.png"
        name={"Samsung Electronics"}
        description={"Computers and Electronics Manufacturing"}
        followers={50}
        following={100}
        posts={80}
      />
      <ProfileTabs />
    </div>
  );
}

export default Profile;
