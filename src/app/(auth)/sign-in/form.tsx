"use client";
import AuthSocial from "@/components/auth-social";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
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
  FormMessage,
} from "@/components/ui/form";
import { redirect } from "next/navigation";
const formSchema = z.object({

  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(20, { message: "Password must be at most 20 characters." }),
});
type FormSchema = z.infer<typeof formSchema>;
export default function SignInForm() {
  const form = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: FormSchema) {
    console.log(data);
    redirect("/home");
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-between h-full">
      <div className="flex-center mt-10">
        <Logo />
      </div>
      <div className="flex items-center flex-col space-y-6">
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
                sign-up
              </TabsTrigger>
              <TabsTrigger
                value="sign-in"
                className="rounded-3xl data-[state=active]:bg-white data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
              >
                sign-in
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
                        <FormControl>
                          <FormInput
                            placeholder="email@example.com"
                            main_icon="/images/letter.png"
                            label="Email Address"
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
                        <FormControl>
                          <FormInput
                            main_icon="/images/lock.png"
                            placeholder="*******"
                            sec_icon={
                              <Image
                                src={"/images/eye.png"}
                                width={24}
                                height={24}
                                alt="eye-icon"
                              />
                            }
                            label="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="h-13 rounded-full w-full">
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          <AuthSocial />
        </div>
      </div>
      <div className="my-6">
        <p className="text-secondary">
          You’re new in here?{" "}
          <Link
            href="/sign-up"
            className="text-primary underline-offset-4 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
