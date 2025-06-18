import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import Message from "./message";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const chatInputSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});
type ChatInput = z.infer<typeof chatInputSchema>;
function AiChat({
  is_open,
  setIsOpen,
}: {
  is_open: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const form = useForm<ChatInput>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: {
      message: "",
    },
  });
  const onSubmit = async (data: ChatInput) => {
    console.log(data);
  };
  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="!top-[45%] bg-gray-50  !p-0 !border-0 !space-y-0 rounded-lg">
        <DialogHeader className="bg-linear-to-r from-fuchsia-800 to-blue-400 text-start space-y-3 bg-main-bg rounded-t-lg px-4 py-3">
          <DialogTitle className="text-start font-normal flex items-center justify-start gap-2">
            <Avatar className="size-9">
              <AvatarImage
                alt="ai_bot"
                src="/images/ai_bot.png"
                className="size-9 rounded-full object-contain"
              />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium leading-tight text-white">
                Export Assistant
              </h3>
              <p className="text-stone-400 text-xs">
                Personal chat bot assistant
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(75vh-200px)] rounded-xl flex-1 px-4 py-6">
          {/* incoming */}
          <Message
            side="left"
            is_ai={true}
            name="Company Name"
            time="3:00 PM"
            content="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
          />

          {/* outgoing */}
          <Message
            is_ai={false}
            side="right"
            name="Company Name"
            time="3:00 PM"
            content="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
          />
        </ScrollArea>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 px-4 py-6 shadow-[0px_-2px_30px_0px_rgba(151,151,151,0.25)] bg-white rounded-b-lg "
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="rounded-full border-stone-400"
                      placeholder="Type your message here..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="bg-linear-to-r from-fuchsia-800 to-blue-400 rounded-full"
              type="submit"
            >
              Send
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AiChat;
