import Image from "next/image";
import React from "react";
import { Input } from "../ui/input";

function Messages() {
  return (
    <div className="main-card flex items-start justify-start flex-col gap-2">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Image src="/images/pen.png" width={24} height={24} alt="arrow-right" />
      </div>
      <div className="h-10 mt-4 flex items-center justify-between w-full bg-main-bg px-2 py-3 rounded-full">
        <div className="flex items-center justify-start gap-2">
          <Image
            src="/images/search.png"
            width={24}
            height={24}
            className="size-6"
            alt="search-right"
          />
          <Input
            placeholder="Search"
            className="w-full bg-transparent border-0 shadow-none "
          />
        </div>
        <Image
          src="/images/sort.png"
          width={24}
          height={24}
          alt="sort"
          className="size-6"
        />
      </div>
      <div className="w-full">
        {Array.from({ length: 10 }, (_, index) => (
          <Message
            key={index}
            profile_image="/images/user-placeholder.png"
            name={`User ${index + 1}`}
            text={`This is Message from user  ${index + 1}`}
            time={`${index + 1} hours ago`}
          />
        ))}
      </div>
    </div>
  );
}

export default Messages;
interface MessageProps {
  profile_image: string;
  name: string;
  text: string;
  time: string;
}
function Message(props: Readonly<MessageProps>) {
  const { profile_image, name, text, time } = props;

  return (
    <div className="p-2 rounded-lg cursor-pointer w-full h-12 flex items-center justify-start gap-1 mb-2 hover:bg-main-bg">
      <Image
        src={profile_image}
        alt="logo"
        width={24}
        className="size-10 rounded-full object-contain"
        height={24}
      />
      <div className="flex-1 flex flex-col items-start justify-start w-full">
        <div className="flex items-center justify-between w-full ">
          <h4 className="capitalize text-base font-semibold ">{name}</h4>
          <p className="text-xs">{time}</p>
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-xs truncate">{text}</p>
          <p className="text-xs size-4 bg-primary text-white rounded-full text-center flex-center">
            4
          </p>
        </div>
      </div>
    </div>
  );
}
