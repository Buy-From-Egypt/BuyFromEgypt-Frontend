"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { FileInput } from "../ui/input-file";
import { toast } from "sonner";
import { useUpdateProfileMutation } from "@/store/apis/profile";
import { Input } from "../ui/input";
interface Props {
  slug: string;
  cover: string;
  name: string;
  description: string;
  followers: number;
  following: number;
  profile: string;
  posts: number;
}
function Info({
  slug,
  name,
  profile,
  cover,
  description,
  followers,
  following,
  posts,
}: Props) {
  const [isUpdateImage, setIsUpdateImage] = React.useState(false);
  const [isUpdateAbout, setIsUpdateAbout] = React.useState(false);
  return (
    <div className="w-full">
      <AspectRatio ratio={20 / 5} className="relative object-cover">
        <Image
          src={cover}
          alt="Image"
          width={1920}
          height={288}
          className="rounded-md h-72 object-cover"
        />
      </AspectRatio>
      <div className="flex items-center justify-start relative">
        <div className="flex  flex-row justify-between gap-4 w-full h-full">
          <div className="transform -translate-y-14  w-56 h-36 relative">
            <div
              onClick={() => setIsUpdateImage(true)}
              className="cursor-pointer size-9 absolute z-50 top-4 right-3 bg-white rounded-full flex-center"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2375_8352)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.9375 9C0.9375 4.5472 4.5472 0.9375 9 0.9375C9.31066 0.9375 9.5625 1.18934 9.5625 1.5C9.5625 1.81066 9.31066 2.0625 9 2.0625C5.16852 2.0625 2.0625 5.16852 2.0625 9C2.0625 12.8315 5.16852 15.9375 9 15.9375C12.8315 15.9375 15.9375 12.8315 15.9375 9C15.9375 8.68934 16.1893 8.4375 16.5 8.4375C16.8107 8.4375 17.0625 8.68934 17.0625 9C17.0625 13.4528 13.4528 17.0625 9 17.0625C4.5472 17.0625 0.9375 13.4528 0.9375 9ZM12.5779 1.70694C13.6038 0.681021 15.2671 0.681021 16.2931 1.70694C17.319 2.73285 17.319 4.39619 16.2931 5.4221L11.307 10.4082C11.0285 10.6867 10.8541 10.8611 10.6594 11.013C10.4302 11.1918 10.1821 11.3451 9.91961 11.4702C9.69676 11.5764 9.46271 11.6544 9.08909 11.7789L6.91069 12.505C6.50851 12.6391 6.0651 12.5344 5.76533 12.2347C5.46556 11.9349 5.36089 11.4915 5.49495 11.0893L6.22108 8.91092C6.34559 8.53729 6.42359 8.30324 6.5298 8.08039C6.65489 7.81791 6.80821 7.56984 6.98703 7.34056C7.13887 7.1459 7.31333 6.97147 7.59183 6.693L12.5779 1.70694ZM15.4976 2.50243C14.911 1.91586 13.96 1.91586 13.3734 2.50243L13.0909 2.7849C13.108 2.85679 13.1318 2.94245 13.1649 3.038C13.2724 3.34779 13.4758 3.75579 13.86 4.13999C14.2442 4.5242 14.6522 4.7276 14.962 4.83508C15.0575 4.86823 15.1432 4.89205 15.2151 4.90907L15.4976 4.62661C16.0841 4.04003 16.0841 3.08901 15.4976 2.50243ZM14.3289 5.79532C13.9419 5.6289 13.4911 5.36209 13.0645 4.93549C12.6379 4.50888 12.3711 4.05812 12.2047 3.67114L8.41313 7.46269C8.10075 7.77508 7.97823 7.89897 7.87411 8.03246C7.74553 8.19731 7.6353 8.37567 7.54536 8.56439C7.47252 8.71722 7.41651 8.8822 7.2768 9.30131L6.95288 10.2731L7.72693 11.0471L8.69869 10.7232C9.1178 10.5835 9.28278 10.5275 9.43561 10.4546C9.62433 10.3647 9.80269 10.2545 9.96754 10.1259C10.101 10.0218 10.2249 9.89926 10.5373 9.58687L14.3289 5.79532Z"
                    fill="#3B3C36"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2375_8352">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <Image
              src={profile}
              alt={name}
              width={192}
              height={192}
              className="w-48 h-48 rounded-lg object-cover ml-8 "
            />
          </div>

          <div className="flex-2 flex flex-col items-start justify-start gap-2 mt-4">
            <h3 className="text-black text-xl font-semibold leading-loose">
              {name}
            </h3>
            <p className="text-sm text-secondary leading-normal font-semibold">
              {description}
            </p>
            <div className="flex items-center justify-start gap-2 ">
              {/* <Button className="flex items-center justify-center !px-7 !py-3 border border-primary bg-transparent rounded-full text-primary hover:bg-transparent">
                <p>Message</p>
                <svg
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="message">
                    <path
                      id="Vector"
                      d="M9.5 16.5C13.6421 16.5 17 13.1421 17 9C17 4.85786 13.6421 1.5 9.5 1.5C5.35786 1.5 2 4.85786 2 9C2 10.1998 2.28171 11.3337 2.7826 12.3394C2.9157 12.6066 2.96001 12.912 2.88284 13.2005L2.43613 14.87C2.24222 15.5947 2.90526 16.2578 3.63001 16.0639L5.29954 15.6172C5.58795 15.54 5.89341 15.5843 6.16065 15.7174C7.16627 16.2183 8.30024 16.5 9.5 16.5Z"
                      stroke="#3B3C36"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>
              </Button>
              <Button className="flex items-center justify-center  w-40 !px-7 !py-3 text-white border border-primary rounded-full  ">
                <p>Follow</p>
                <svg
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="#ffff"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="plus">
                    <g id="Vector">
                      <path
                        d="M10.0625 6.75C10.0625 6.43934 9.81066 6.1875 9.5 6.1875C9.18934 6.1875 8.9375 6.43934 8.9375 6.75L8.9375 8.43752H7.25C6.93934 8.43752 6.6875 8.68936 6.6875 9.00002C6.6875 9.31068 6.93934 9.56252 7.25 9.56252H8.9375V11.25C8.9375 11.5607 9.18934 11.8125 9.5 11.8125C9.81066 11.8125 10.0625 11.5607 10.0625 11.25L10.0625 9.56252H11.75C12.0607 9.56252 12.3125 9.31068 12.3125 9.00002C12.3125 8.68936 12.0607 8.43752 11.75 8.43752H10.0625V6.75Z"
                        fill="#EAECE1"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.5 0.9375C5.0472 0.9375 1.4375 4.5472 1.4375 9C1.4375 13.4528 5.0472 17.0625 9.5 17.0625C13.9528 17.0625 17.5625 13.4528 17.5625 9C17.5625 4.5472 13.9528 0.9375 9.5 0.9375ZM2.5625 9C2.5625 5.16852 5.66852 2.0625 9.5 2.0625C13.3315 2.0625 16.4375 5.16852 16.4375 9C16.4375 12.8315 13.3315 15.9375 9.5 15.9375C5.66852 15.9375 2.5625 12.8315 2.5625 9Z"
                        fill="#EAECE1"
                      />
                    </g>
                  </g>
                </svg>
              </Button> */}
            </div>
          </div>
          <div className="flex-1 flex flex-row items-end justify-end gap-6 mt-4  mb-1">
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm">Followers</p>
              <p className="text-black text-2xl font-semibold">{followers}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm">Following</p>
              <p className="text-black text-2xl font-semibold">{following}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm">Post</p>
              <p className="text-black text-2xl font-semibold">{followers}</p>
            </div>
          </div>
        </div>
        <UpdateImage isOpen={isUpdateImage} setIsOpen={setIsUpdateImage} />
       
      </div>
    </div>
  );
}

export default Info;
const FormSchema = z.object({
  profileImage: z.array(z.instanceof(File)).optional(),
});
type FormValues = z.infer<typeof FormSchema>;
function UpdateImage({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profileImage: undefined,
    },
  });
  async function onSubmit(data: FormValues) {
    const formData = new FormData();
    formData.append("profileImage", data.profileImage![0]);
    await updateProfile(formData)
      .unwrap()
      .then((res) => {
        toast.success("Profile image updated successfully");
        setIsOpen(false);
      })
      .catch(({ data }) => {
        toast.error(data.message);
      });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white  p-0">
        <DialogHeader className="text-start space-y-3 bg-main-bg rounded-t-lg p-4">
          <DialogTitle className="text-start font-normal">
            Create Post
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-2 space-x-2 pb-5"
          >
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <FileInput
                      value={field.value}
                      onChange={field.onChange}
                      accept="image/*"
                      className="w-full min-h-60"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-center px-4">
              <Button
                disabled={!form.formState.isDirty || isLoading}
                isLoading={isLoading}
                type="submit"
                className="w-full mt-4"
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export { UpdateImage };
