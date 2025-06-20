"use client";
import { Separator } from "@/components/ui/separator";
import { useUpdateProfileMutation } from "@/store/apis/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import React, { JSX } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import { SocialMediaList } from "./social-media-list";
import { SocialMedia } from "@/types/social-media";
import Link from "next/link";
interface Props {
  about: string;
  phoneNumber: string;
  email: string;
  address: string;
  cityState: string;
  postCode: string;
  socialMedias: SocialMedia[];
}

function CompanyInfo({
  about,
  phoneNumber,
  email,
  address,
  socialMedias,
}: Props) {
  const [isUpdateAbout, setIsUpdateAbout] = React.useState(false);
  const [isUpdateContact, setIsUpdateContact] = React.useState(false);
  const [isUpdateAddress, setIsUpdateAddress] = React.useState(false);
  const [isUpdateSocial, setIsUpdateSocial] = React.useState(false);
  return (
    <div className="bg-white p-4 flex flex-col gap-4 rounded-xl mt-6">
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
            About
          </h3>
          <Pencil
            className="text-stone-600 size-4 cursor-pointer"
            onClick={() => setIsUpdateAbout(true)}
          />
        </div>
        <p className="text-stone-400 leading-tight">{about}</p>
      </div>
      <Separator className="bg-stone-200" />
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
            Contact
          </h3>
          <Pencil
            className="text-stone-600 size-4 cursor-pointer"
            onClick={() => setIsUpdateContact(true)}
          />
        </div>
        <div className="flex items-start flex-col gap-3">
          <div className="flex items-center gap-2">
            <PhoneSvg />
            <span className="text-stone-400 flex gap-2">
              <p>Phone :</p>
            </span>
            <p>{phoneNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 flex gap-2">
              <EmailSvg />
              <p>Email :</p>
            </span>
            <p>{email}</p>
          </div>
        </div>
      </div>
      <Separator className="bg-stone-200" />
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
            Address:
          </h3>
          <Pencil
            className="text-stone-600 size-4 cursor-pointer"
            onClick={() => setIsUpdateAddress(true)}
          />
        </div>
        <div className="flex items-start flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 flex gap-2">
              <AddressSvg />
              <p>Address: :</p>
            </span>
            <p>{address}</p>
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-stone-400 flex gap-2">
              <CityState />
              <p>City State:</p>
            </span>
            <p>{cityState}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 flex gap-2">
              <PostCodeSvg />
              <p>Post Code:</p>
            </span>
            <p>{postCode}</p>
          </div> */}
        </div>
      </div>
      <Separator className="bg-stone-200" />
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-xl font-normal leading-loose text-stone-700">
            Social Media
          </h3>
          {/* <Pencil className="text-stone-600 size-4" /> */}
        </div>
        <div className="flex items-center justify-start gap-2">
          {socialMedias?.map((socialMedia) => (
            <Link
              key={socialMedia.id}
              href={socialMedia.url}
              target="_blank"
              className="cursor-pointer size-10  rounded-full flex-center"
            >
              {socialMedia.platform === "facebook" &&<FacebookSvg /> }
              {socialMedia.platform === "whatsapp" &&<WhatsAppSvg /> }
              {socialMedia.platform === "instagram" &&<InstagramSvg /> }
              {socialMedia.platform === "x" &&<TwitterSvg /> }
              {/* {socialMedia.platform === "youtube" &&<YouTubeSvg /> } */}
            </Link>
          ))}

        </div>
      </div>
      <UpdateAbout
        defaultValue={about}
        isOpen={isUpdateAbout}
        setIsOpen={setIsUpdateAbout}
      />
      <UpdateContact
        defaultValue={{ email, phoneNumber }}
        isOpen={isUpdateContact}
        setIsOpen={setIsUpdateContact}
      />
      <UpdateAddress
        defaultValue={{ address }}
        isOpen={isUpdateAddress}
        setIsOpen={setIsUpdateAddress}
      />
    </div>
  );
}

export default CompanyInfo;
const AboutFormSchema = z.object({
  about: z.string().min(1, "About is required"),
});
type AboutFormValues = z.infer<typeof AboutFormSchema>;
function UpdateAbout({
  isOpen,
  setIsOpen,
  defaultValue,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  defaultValue: string;
}) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm({
    resolver: zodResolver(AboutFormSchema),
    defaultValues: {
      about: defaultValue,
    },
  });
  async function onSubmit(data: AboutFormValues) {
    await updateProfile(data)
      .unwrap()
      .then((res) => {
        toast.success("Profile updated successfully");
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
            Update Your About
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-2 space-x-2 pb-5"
          >
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <Textarea className="min-h-30" {...field} />
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

const ContactFormSchema = z.object({
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});
type ContactFormValues = z.infer<typeof ContactFormSchema>;
function UpdateContact({
  isOpen,
  setIsOpen,
  defaultValue,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  defaultValue: ContactFormValues;
}) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      email: defaultValue.email,
      phoneNumber: defaultValue.phoneNumber,
    },
  });
  async function onSubmit(data: ContactFormValues) {
    await updateProfile(data)
      .unwrap()
      .then((res) => {
        toast.success("Profile updated successfully");
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
            Update Your Contact
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-2 space-x-2 pb-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <Input main_icon={<EmailSvg />} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <PhoneInput {...field} />
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
const AddressFormSchema = z.object({
  address: z.string().min(1, "Address is required"),
});
type AddressFormValues = z.infer<typeof AddressFormSchema>;
function UpdateAddress({
  isOpen,
  setIsOpen,
  defaultValue,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  defaultValue: AddressFormValues;
}) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      address: defaultValue.address,
    },
  });
  async function onSubmit(data: AddressFormValues) {
    await updateProfile(data)
      .unwrap()
      .then((res) => {
        toast.success("Profile updated successfully");
        setIsOpen(false);
      })
      .catch(({ data }) => {
        toast.error(data.message);
      });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white p-0 pb-4">
        <DialogHeader className="text-start space-y-3 bg-main-bg rounded-t-lg p-4">
          <DialogTitle className="text-start font-normal">
            Update Address
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <Input
                      placeholder="address..."
                      main_icon={<AddressSvg />}
                      {...field}
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
//social media create and update

const SocialMediaFormSchema = z.object({
  facebook: z.string().url("Invalid URL"),
  twitter: z.string().url("Invalid URL"),
  instagram: z.string().url("Invalid URL"),
  whatsapp: z.string().url("Invalid URL"),
});
type SocialMediaFormValues = z.infer<typeof SocialMediaFormSchema>;
function SocialMediaForm({
  isOpen,
  setIsOpen,
  defaultValue,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  defaultValue: SocialMediaFormValues;
}) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(SocialMediaFormSchema),
    defaultValues: {
      facebook: defaultValue.facebook,
      twitter: defaultValue.twitter,
      instagram: defaultValue.instagram,
      whatsapp: defaultValue.whatsapp,
    },
  });
  async function onSubmit(data: SocialMediaFormValues) {
    await updateProfile(data)
      .unwrap()
      .then((res) => {
        toast.success("Profile updated successfully");
        setIsOpen(false);
      })
      .catch(({ data }) => {
        toast.error(data.message);
      });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white p-0 pb-4">
        <DialogHeader className="text-start space-y-3 bg-main-bg rounded-t-lg p-4">
          <DialogTitle className="text-start font-normal">
            Update Social Media
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <Input
                      placeholder="facebook..."
                      main_icon={<FacebookSvg />}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <Input
                      placeholder="twitter..."
                      main_icon={<TwitterSvg />}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <Input
                      placeholder="instagram..."
                      main_icon={<InstagramSvg />}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <FormControl>
                    <Input
                      placeholder="whatsapp..."
                      main_icon={<WhatsAppSvg />}
                      {...field}
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

function PhoneSvg(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2C14 2 16.2 2.2 19 5C21.8 7.8 22 10 22 10"
        stroke="#A7A99C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.207 5.53564C14.207 5.53564 15.197 5.81849 16.6819 7.30341C18.1668 8.78834 18.4497 9.77829 18.4497 9.77829"
        stroke="#A7A99C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.0376 5.31617L10.6866 6.4791C11.2723 7.52858 11.0372 8.90533 10.1147 9.8278C10.1147 9.8278 8.99578 10.9467 11.0245 12.9755C13.0532 15.0042 14.1722 13.8853 14.1722 13.8853C15.0947 12.9628 16.4714 12.7277 17.5209 13.3134L18.6838 13.9624C20.2686 14.8468 20.4557 17.0692 19.0628 18.4622C18.2258 19.2992 17.2004 19.9505 16.0669 19.9934C14.1588 20.0658 10.9183 19.5829 7.6677 16.3323C4.41713 13.0817 3.93421 9.84122 4.00655 7.93309C4.04952 6.7996 4.7008 5.77423 5.53781 4.93723C6.93076 3.54428 9.15317 3.73144 10.0376 5.31617Z"
        stroke="#A7A99C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function EmailSvg(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
        stroke="#A7A99C"
        strokeWidth="1.5"
      />
      <path
        d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
        stroke="#A7A99C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function AddressSvg(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 8L18.9487 8.31623C19.9387 8.64624 20.4337 8.81124 20.7169 9.20407C21 9.5969 21 10.1187 21 11.1623V16.829C21 18.1199 21 18.7653 20.6603 19.18C20.5449 19.3208 20.4048 19.4394 20.247 19.5301C19.7821 19.797 19.1455 19.6909 17.8721 19.4787C16.6157 19.2693 15.9875 19.1646 15.3648 19.2167C15.1463 19.235 14.9292 19.2676 14.715 19.3144C14.1046 19.4477 13.5299 19.735 12.3806 20.3097C10.8809 21.0596 10.131 21.4345 9.33284 21.5501C9.09242 21.5849 8.8498 21.6021 8.60688 21.6016C7.80035 21.6001 7.01186 21.3373 5.43488 20.8116L5.05132 20.6838C4.06129 20.3538 3.56627 20.1888 3.28314 19.7959C3 19.4031 3 18.8813 3 17.8377V12.908C3 11.2491 3 10.4197 3.48841 9.97358C3.57388 9.89552 3.66809 9.82762 3.76917 9.77122C4.34681 9.44894 5.13369 9.71123 6.70746 10.2358"
        stroke="#A7A99C"
        strokeWidth="1.5"
      />
      <path
        d="M6 7.70031C6 4.55211 8.68629 2 12 2C15.3137 2 18 4.55211 18 7.70031C18 10.8238 16.085 14.4687 13.0972 15.7721C12.4007 16.076 11.5993 16.076 10.9028 15.7721C7.91499 14.4687 6 10.8238 6 7.70031Z"
        stroke="#A7A99C"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="8" r="2" stroke="#A7A99C" strokeWidth="1.5" />
    </svg>
  );
}
function CityState(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 1.25C7.41421 1.25 7.75 1.58579 7.75 2V3.75H8C8.01496 3.75 8.02987 3.75 8.04475 3.75C8.47757 3.74995 8.8744 3.7499 9.19721 3.7933C9.55269 3.84109 9.92841 3.95354 10.2374 4.26256C10.5465 4.57159 10.6589 4.94731 10.7067 5.30279C10.7501 5.62561 10.7501 6.02244 10.75 6.45526C10.75 6.47013 10.75 6.48504 10.75 6.5V7.88206C10.8169 7.93503 10.8818 7.99268 10.9445 8.05546C11.4 8.51093 11.5857 9.07773 11.6701 9.70552C11.7284 10.139 11.7442 10.6545 11.7484 11.25H12.25L12.25 7.71C12.25 6.45165 12.2499 5.42299 12.3656 4.6381C12.4856 3.82422 12.7528 3.09753 13.4336 2.62571C14.1145 2.15388 14.8887 2.15884 15.6929 2.33231C16.4684 2.49959 17.4316 2.8608 18.6098 3.30267L18.7057 3.33862C19.3012 3.56191 19.8051 3.75085 20.2009 3.95182C20.6219 4.16555 20.9859 4.42361 21.2603 4.81961C21.5347 5.21562 21.6486 5.647 21.7009 6.11624C21.75 6.55746 21.75 7.0956 21.75 7.73158V21.25H22C22.4142 21.25 22.75 21.5858 22.75 22C22.75 22.4142 22.4142 22.75 22 22.75H2C1.58579 22.75 1.25 22.4142 1.25 22C1.25 21.5858 1.58579 21.25 2 21.25H2.25L2.25 11.948C2.24997 11.0495 2.24994 10.3003 2.32991 9.70552C2.41432 9.07773 2.59999 8.51093 3.05546 8.05546C3.11823 7.99268 3.18313 7.93503 3.25 7.88206V6.5C3.25 6.48504 3.25 6.47013 3.25 6.45525C3.24995 6.02243 3.2499 5.6256 3.2933 5.30279C3.34109 4.94731 3.45354 4.57159 3.76256 4.26256C4.07159 3.95354 4.44731 3.84109 4.80279 3.7933C5.1256 3.7499 5.52243 3.74995 5.95525 3.75C5.97012 3.75 5.98504 3.75 6 3.75H6.25V2C6.25 1.58579 6.58579 1.25 7 1.25ZM4.75 7.32412C5.33751 7.24995 6.07178 7.24997 6.94801 7.25H7.05199C7.92822 7.24997 8.66249 7.24995 9.25 7.32412V6.5C9.25 6.00739 9.24841 5.71339 9.22008 5.50266C9.20709 5.40611 9.1918 5.35774 9.18284 5.33596C9.18077 5.33092 9.17915 5.3276 9.17814 5.32567L9.17676 5.32324L9.17433 5.32186C9.1724 5.32085 9.16908 5.31923 9.16404 5.31716C9.14226 5.3082 9.09389 5.29291 8.99734 5.27992C8.78661 5.25159 8.49261 5.25 8 5.25H6C5.50739 5.25 5.21339 5.25159 5.00266 5.27992C4.90611 5.29291 4.85774 5.3082 4.83596 5.31716C4.83092 5.31923 4.8276 5.32085 4.82567 5.32186L4.82324 5.32324L4.82186 5.32567C4.82085 5.3276 4.81923 5.33092 4.81716 5.33596C4.8082 5.35774 4.79291 5.40611 4.77992 5.50266C4.75159 5.71339 4.75 6.00739 4.75 6.5V7.32412ZM3.75 21.25H6.25L6.25 15.948C6.24997 15.0495 6.24995 14.3003 6.32991 13.7055C6.41432 13.0777 6.59999 12.5109 7.05546 12.0555C7.51093 11.6 8.07773 11.4143 8.70552 11.3299C9.13855 11.2717 9.65344 11.2559 10.2482 11.2516C10.244 10.6814 10.23 10.2512 10.1835 9.90539C10.1214 9.44393 10.0142 9.24643 9.88388 9.11612C9.75357 8.9858 9.55607 8.87858 9.09461 8.81654C8.61157 8.75159 7.96401 8.75 7 8.75C6.03599 8.75 5.38843 8.75159 4.90539 8.81654C4.44393 8.87858 4.24643 8.9858 4.11612 9.11612C3.9858 9.24643 3.87858 9.44393 3.81654 9.90539C3.75159 10.3884 3.75 11.036 3.75 12V21.25ZM7.75 21.25H16.25V16C16.25 15.036 16.2484 14.3884 16.1835 13.9054C16.1214 13.4439 16.0142 13.2464 15.8839 13.1161C15.7536 12.9858 15.5561 12.8786 15.0946 12.8165C14.6116 12.7516 13.964 12.75 13 12.75H11C10.036 12.75 9.38843 12.7516 8.90539 12.8165C8.44393 12.8786 8.24643 12.9858 8.11612 13.1161C7.9858 13.2464 7.87858 13.4439 7.81654 13.9054C7.75159 14.3884 7.75 15.036 7.75 16V21.25ZM17.75 21.25H20.25V7.772C20.25 7.08479 20.2489 6.63075 20.2101 6.28238C20.1734 5.95272 20.1091 5.79193 20.0274 5.67401C19.9457 5.55609 19.8177 5.43949 19.5219 5.28934C19.2094 5.13066 18.7846 4.97023 18.1412 4.72893C16.8906 4.25997 16.0312 3.93978 15.3766 3.79858C14.7379 3.66082 14.468 3.73388 14.288 3.85859C14.108 3.98331 13.9448 4.21044 13.8496 4.8568C13.752 5.5193 13.75 6.43639 13.75 7.772V11.2516C14.3455 11.2558 14.861 11.2716 15.2945 11.3299C15.9223 11.4143 16.4891 11.6 16.9445 12.0555C17.4 12.5109 17.5857 13.0777 17.6701 13.7055C17.7501 14.3003 17.75 15.0495 17.75 15.948L17.75 21.25ZM4.82324 5.32324C4.82357 5.32297 4.82364 5.32283 4.82324 5.32324C4.82278 5.32369 4.82296 5.32358 4.82324 5.32324ZM9.25 15C9.25 14.5858 9.58579 14.25 10 14.25H14C14.4142 14.25 14.75 14.5858 14.75 15C14.75 15.4142 14.4142 15.75 14 15.75H10C9.58579 15.75 9.25 15.4142 9.25 15ZM9.25 18C9.25 17.5858 9.58579 17.25 10 17.25H14C14.4142 17.25 14.75 17.5858 14.75 18C14.75 18.4142 14.4142 18.75 14 18.75H10C9.58579 18.75 9.25 18.4142 9.25 18Z"
        fill="#A7A99C"
      />
    </svg>
  );
}
function PostCodeSvg(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 10.1433C3.25 5.24427 7.15501 1.25 12 1.25C16.845 1.25 20.75 5.24427 20.75 10.1433C20.75 12.5084 20.076 15.0479 18.8844 17.2419C17.6944 19.4331 15.9556 21.3372 13.7805 22.3539C12.6506 22.882 11.3494 22.882 10.2195 22.3539C8.04437 21.3372 6.30562 19.4331 5.11556 17.2419C3.92403 15.0479 3.25 12.5084 3.25 10.1433ZM12 2.75C8.00843 2.75 4.75 6.04748 4.75 10.1433C4.75 12.2404 5.35263 14.5354 6.4337 16.526C7.51624 18.5192 9.04602 20.1496 10.8546 20.995C11.5821 21.335 12.4179 21.335 13.1454 20.995C14.954 20.1496 16.4838 18.5192 17.5663 16.526C18.6474 14.5354 19.25 12.2404 19.25 10.1433C19.25 6.04748 15.9916 2.75 12 2.75ZM12 7.75C10.7574 7.75 9.75 8.75736 9.75 10C9.75 11.2426 10.7574 12.25 12 12.25C13.2426 12.25 14.25 11.2426 14.25 10C14.25 8.75736 13.2426 7.75 12 7.75ZM8.25 10C8.25 7.92893 9.92893 6.25 12 6.25C14.0711 6.25 15.75 7.92893 15.75 10C15.75 12.0711 14.0711 13.75 12 13.75C9.92893 13.75 8.25 12.0711 8.25 10Z"
        fill="#A7A99C"
      />
    </svg>
  );
}
function FacebookSvg(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 2H14C12.6739 2 11.4021 2.52678 10.4645 3.46447C9.52678 4.40215 9 5.67392 9 7V10H6V14H9V22H13V14H16L17 10H13V7C13 6.73478 13.1054 6.48043 13.2929 6.29289C13.4804 6.10536 13.7348 6 14 6H17V2Z"
        stroke="#A7A99C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TwitterSvg(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_2375_6784"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <path d="M0 0H24V24H0V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_2375_6784)">
        <path
          d="M17.75 3H20.8171L14.1171 10.6239L22 21H15.8286L10.9914 14.7082L5.46286 21H2.39286L9.55857 12.8427L2 3.00142H8.32857L12.6943 8.75126L17.75 3ZM16.6714 19.1728H18.3714L7.4 4.73219H5.57714L16.6714 19.1728Z"
          fill="#A7A99C"
        />
      </g>
    </svg>
  );
}
function InstagramSvg(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 17.7383 21.3889 19.2135 20.3012 20.3012C19.2135 21.3889 17.7383 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 6.26174 2.61107 4.78649 3.69878 3.69878C4.78649 2.61107 6.26174 2 7.8 2ZM7.6 4C6.64522 4 5.72955 4.37928 5.05442 5.05442C4.37928 5.72955 4 6.64522 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C17.3548 20 18.2705 19.6207 18.9456 18.9456C19.6207 18.2705 20 17.3548 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.5815 5.5 17.8995 5.6317 18.1339 5.86612C18.3683 6.10054 18.5 6.41848 18.5 6.75C18.5 7.08152 18.3683 7.39946 18.1339 7.63388C17.8995 7.8683 17.5815 8 17.25 8C16.9185 8 16.6005 7.8683 16.3661 7.63388C16.1317 7.39946 16 7.08152 16 6.75C16 6.41848 16.1317 6.10054 16.3661 5.86612C16.6005 5.6317 16.9185 5.5 17.25 5.5ZM12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7ZM12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z"
        fill="#A7A99C"
      />
    </svg>
  );
}
function WhatsAppSvg(): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.0498 4.91005C18.1329 3.98416 17.0408 3.25002 15.8373 2.75042C14.6338 2.25081 13.3429 1.99574 12.0398 2.00005C6.5798 2.00005 2.1298 6.45005 2.1298 11.9101C2.1298 13.6601 2.5898 15.3601 3.4498 16.8601L2.0498 22.0001L7.2998 20.6201C8.7498 21.4101 10.3798 21.8301 12.0398 21.8301C17.4998 21.8301 21.9498 17.3801 21.9498 11.9201C21.9498 9.27005 20.9198 6.78005 19.0498 4.91005ZM12.0398 20.1501C10.5598 20.1501 9.1098 19.7501 7.8398 19.0001L7.5398 18.8201L4.4198 19.6401L5.2498 16.6001L5.0498 16.2901C4.22735 14.9771 3.79073 13.4593 3.7898 11.9101C3.7898 7.37005 7.4898 3.67005 12.0298 3.67005C14.2298 3.67005 16.2998 4.53005 17.8498 6.09005C18.6174 6.85392 19.2257 7.7626 19.6394 8.76338C20.0531 9.76417 20.264 10.8371 20.2598 11.9201C20.2798 16.4601 16.5798 20.1501 12.0398 20.1501ZM16.5598 13.9901C16.3098 13.8701 15.0898 13.2701 14.8698 13.1801C14.6398 13.1001 14.4798 13.0601 14.3098 13.3001C14.1398 13.5501 13.6698 14.1101 13.5298 14.2701C13.3898 14.4401 13.2398 14.4601 12.9898 14.3301C12.7398 14.2101 11.9398 13.9401 10.9998 13.1001C10.2598 12.4401 9.7698 11.6301 9.6198 11.3801C9.4798 11.1301 9.5998 11.0001 9.7298 10.8701C9.8398 10.7601 9.9798 10.5801 10.0998 10.4401C10.2198 10.3001 10.2698 10.1901 10.3498 10.0301C10.4298 9.86005 10.3898 9.72005 10.3298 9.60005C10.2698 9.48005 9.7698 8.26005 9.5698 7.76005C9.3698 7.28005 9.1598 7.34005 9.0098 7.33005H8.5298C8.3598 7.33005 8.0998 7.39005 7.8698 7.64005C7.6498 7.89005 7.0098 8.49005 7.0098 9.71005C7.0098 10.9301 7.89981 12.1101 8.0198 12.2701C8.1398 12.4401 9.7698 14.9401 12.2498 16.0101C12.8398 16.2701 13.2998 16.4201 13.6598 16.5301C14.2498 16.7201 14.7898 16.6901 15.2198 16.6301C15.6998 16.5601 16.6898 16.0301 16.8898 15.4501C17.0998 14.8701 17.0998 14.3801 17.0298 14.2701C16.9598 14.1601 16.8098 14.1101 16.5598 13.9901Z"
        fill="#A7A99C"
      />
    </svg>
  );
}
