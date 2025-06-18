import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function Message({
  side,
  name,
  time,
  content,
  is_ai,
  left_image,
  right_image,
}: {
  side: "left" | "right";
  name: string;
  time: string;
  is_ai: boolean;
  content: string;
  left_image?: string;
  right_image?: string;
}) {
  const isLeft = side === "left";
  return (
    <div
      className={`flex ${
        isLeft ? "items-end gap-3" : "items-end gap-3 justify-end"
      } mb-5`}
    >
      {/* avatar */}
      {isLeft && (
        <Avatar className="size-9">
          <AvatarImage
            alt="ai_bot"
            src={is_ai ? "/images/ai_bot.png" : left_image}
            className="size-9 rounded-full object-contain"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      {/* bubble */}
      <div className="flex flex-col max-w-[80%]">
        <div
          className={` rounded-lg px-4  py-3 text-sm ${
            isLeft
              ? "bg-gray-100 text-gray-800 rounded-bl-none"
              : "bg-indigo-500 text-white rounded-br-none"
          }`}
        >
          <p className="font-medium">{name}</p>
          <p className="mt-1 leading-relaxed">{content}</p>
        </div>
        <span
          className={`mt-2 block text-[11px] opacity-70 ${
            isLeft ? "text-left" : "text-right"
          }`}
        >
          {time}
        </span>
      </div>
      {!isLeft && (
        <Avatar className="size-9">
          <AvatarImage
            alt="ai_bot"
            src={is_ai ? "/avatar-placeholder.png" : left_image}
            className="size-9 rounded-full object-contain"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export default Message;
