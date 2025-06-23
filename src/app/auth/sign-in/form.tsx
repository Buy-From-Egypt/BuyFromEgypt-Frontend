"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginMutation } from "@/store/apis/auth.api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(32, { message: "Password must be at most 32 characters." }),
});
type FormSchema = z.infer<typeof formSchema>;
export default function SignInForm() {
  const { login: loginAuth } = useAuth();
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "raza4omeh5@maildax.me",
      password: "Pa$$w00rd@me1",
    },
  });

  async function onSubmit(data: FormSchema) {
    console.log(data);
    await login(data)
      .unwrap()
      .then((res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("userId", res.user.userId);
        loginAuth(res.user, res.token);
        router.push("/home");
      })
      .catch((error: any) => {
        const errorMessage = error?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
      });
  }
  return (
    <div className="flex gap-4 items-center justify-center h-full">
      <div className="main-card flex items-center flex-col space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-black">Welcome Back!</h3>
          <p className="text-sm text-secondary">Please enter your details </p>
        </div>
        <div className="my-4">
          <Tabs defaultValue="sign-in" className="w-[400px]">
            <TabsList className="w-full p-0.5 h-14 bg-main-bg rounded-full">
              <TabsTrigger
                disabled
                value="sign-up"
                className="rounded-3xl data-[state=active]:bg-white data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="sign-in"
                className="rounded-3xl data-[state=active]:bg-white data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
              >
                Sign In
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in" className="space-y-4 mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@example.com"
                            type="email"
                            main_icon={
                              <Image
                                src="/images/letter.png"
                                alt="email"
                                height={26}
                                width={26}
                              />
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="*************"
                            type={showPassword ? "text" : "password"}
                            main_icon={
                              <Image
                                src="/images/lock.png"
                                alt="lock"
                                height={26}
                                width={26}
                              />
                            }
                            second_icon={
                              <Image
                                src={
                                  showPassword
                                    ? "/images/eye.png"
                                    : "/images/Eye Closed.png"
                                }
                                alt="eye"
                                className="cursor-pointer"
                                height={26}
                                width={26}
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="terms">Remember me</Label>
                    </div>
                    <Link
                      href="forgot-password"
                      className="text-primary underline-offset-1 underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className=" rounded-full w-full"
                  >
                    Sign In
                  </Button>
                </form>
              </Form>
              <div className="mt-6 text-center">
                <p className="text-secondary">
                  You’re new in here?{" "}
                  <Link
                    href="sign-up"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </TabsContent>
          </Tabs>
          {/* <AuthSocial /> */}
        </div>
      </div>
    </div>
  );
}
