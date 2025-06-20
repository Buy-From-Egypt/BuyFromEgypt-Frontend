"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useVerifyOtpEmailMutation } from "@/store/apis/auth.api";
import { toast } from "sonner";

interface Props {
  email: string;
  is_open: boolean;
  onOpenChange: (open: boolean) => void;
}
const FormSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "OTP must be at least 6 characters." })
    .max(6, { message: "OTP must be at most 6 characters." }),
});
type FormData = z.infer<typeof FormSchema>;
function VerifyAccount({ email, is_open, onOpenChange }: Readonly<Props>) {
  const [verifyOtpEmail, { isLoading }] = useVerifyOtpEmailMutation();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });
  async function onSubmit(data: FormData) {
    console.log(data);
    // redirect("sign-in");
    await verifyOtpEmail({
      identifier: email,
      otpCode: data.otp,
    })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        onOpenChange(false);
        router.push("/auth/preferences");
      })
      .catch(({ data }) => {
        toast.error(data.message);
      });
  }
  return (
    <Dialog open={is_open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white !max-w-sm">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-center font-normal">
            Verify Your Account
          </DialogTitle>
          <div className="flex-center">
            <Image
              src="/images/sms.png"
              alt="sms"
              width={100}
              height={100}
              className="size-20"
            />
          </div>
          <DialogDescription className="flex-center flex-col text-center space-y-3">
            <span className="text-accent">
              Enter 4 digits verification code we have send to
            </span>
            <br />
            <span className="font-semibold">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className=" flex items-center justify-center space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        {...field}
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={!form.formState.isDirty || isLoading}
                isLoading={isLoading}
                type="submit"
                variant={"default"}
                className="h-12 mt-6 rounded-full w-full"
              >
                Verify
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyAccount;
