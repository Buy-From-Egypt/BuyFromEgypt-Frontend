"use client";
import VerifyAccount from "@/components/dialogs/verify-account";
import { GlobalSvg, IdentitySvg, IDSvg } from "@/components/svgs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useForgotPasswordMutation,
  useRegisterMutation,
} from "@/store/apis/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .regex(/^.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*$/, {
      message: "Password must contain at least one special character.",
    })
    .min(8, { message: "Password must be at least 8 characters." })
    .max(32, { message: "Password must be at most 32 characters." }),
  type: z.enum(["IMPORTER", "EXPORTER"]),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number must be at least 8 characters." }),
  taxId: z
    .string()
    .min(8, { message: "Tax ID must be at least 8 characters." }),
  nationalId: z
    .string()
    .min(8, { message: "National ID must be at least 8 characters." }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters." }),
  age: z.string().min(2, { message: "Age must be at least 2 characters." }),
});

type FormSchema = z.infer<typeof formSchema>;
export default function SignUpForm() {
  const [register, { isLoading }] = useRegisterMutation();
  const [requestOtp, { isLoading: isLoadingOtp }] = useForgotPasswordMutation();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number>(1);
  const [open, setOpen] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      password: "Pa$$w00rd@me",
      type: "EXPORTER",
      phoneNumber: "",
      taxId: "",
      nationalId: "",
      country: "",
      age: "",
    },
  });

  async function onSubmit(data: FormSchema) {
    try {
      setEmail(data.email);

      // Register the user
      const registerResponse = await register(data).unwrap();
      if (registerResponse.user?.userId) {
        localStorage.setItem("userId", registerResponse.user.userId);
      }
      toast.success(registerResponse.message);

      // Request OTP for email verification
      if (registerResponse?.user) {
        const otpResponse = await requestOtp({
          identifier: data.email,
        }).unwrap();
        toast.success(otpResponse.message);
      }

      setOpen(true);
    } catch (error: any) {
      const errorMessage =
        error.data?.message || "An error occurred during registration";
      toast.error(errorMessage);

      // console.error("Registration error:", error);
    }
    // redirect("sign-in");
  }
  const handleContinue = async () => {
    const valid = await form.trigger(["name", "email", "password", "type"]);
    if (valid) {
      setStep(2);
    }
  };

  useEffect(() => {
    if (step === 1) {
      form.clearErrors(["phoneNumber", "taxId", "nationalId", "country"]);
    }
  }, [step]);

  return (
    <div className="flex gap-4 items-center justify-center h-full">
      <div className="main-card flex items-center flex-col space-y-6">
        {step === 1 ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-black">
              Create an account
            </h3>
            <p className="text-sm text-secondary">Please enter your details </p>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-black">
              Complete Your Business Data
            </h3>
            <p className="text-sm text-secondary">Please enter your details </p>
          </div>
        )}

        <div className="my-4">
          <Tabs defaultValue="sign-up" className="w-[400px]">
            {step === 1 && (
              <TabsList className="w-full p-0.5 h-14 bg-main-bg rounded-full">
                <TabsTrigger
                  value="sign-up"
                  className="rounded-3xl data-[state=active]:bg-white data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
                >
                  sign-up
                </TabsTrigger>
                <TabsTrigger
                  disabled
                  value="sign-in"
                  className="rounded-3xl data-[state=active]:bg-white data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
                >
                  sign-in
                </TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="sign-up" className="space-y-4 mt-4">
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {step === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                main_icon={
                                  <Image
                                    src="/images/user.png"
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
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex items-center justify-between gap-4"
                              >
                                <FormItem className="h-16 w-full rounded-lg border-2 border-main-bg flex items-center justify-between px-2 space-x-3 space-y-0">
                                  <FormLabel className="text-lg font-normal">
                                    Importer
                                  </FormLabel>
                                  <FormControl className="cursor-pointer">
                                    <RadioGroupItem
                                      value="IMPORTER"
                                      defaultChecked
                                      className="!size-6"
                                    />
                                  </FormControl>
                                </FormItem>
                                <FormItem className="h-16 w-full rounded-lg border-2 border-main-bg flex items-center justify-between px-2 space-x-3 space-y-0">
                                  <FormLabel className="text-lg font-normal">
                                    Exporter
                                  </FormLabel>
                                  <FormControl className="cursor-pointer">
                                    <RadioGroupItem
                                      value="EXPORTER"
                                      className="!size-6"
                                    />
                                  </FormControl>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                              <PhoneInput className="!border-r-0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123-456-789"
                                main_icon={<IdentitySvg />}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nationalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="30303562804756"
                                main_icon={<IDSvg />}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Egypt"
                                main_icon={<GlobalSvg />}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="22"
                                main_icon={
                                  <Image
                                    src="/images/user.png"
                                    alt="age"
                                    height={26}
                                    width={26}
                                  />
                                }
                                // type="number"
                                {...field}
                                // value={(value) => (value ? Number(value) : null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step Navigation */}
                  <div>
                    {step === 1 ? (
                      <Button
                        type="button"
                        onClick={handleContinue}
                        className="!h-13 mt-3 rounded-full w-full"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        // onClick={() => }
                        isLoading={isLoading}
                        className="!h-13 mt-3 rounded-full w-full"
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-secondary">
                  Already have an account?{" "}
                  <Link
                    href="sign-in"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Login Here
                  </Link>
                </p>
              </div>
            </TabsContent>
          </Tabs>
          {/* <AuthSocial /> */}
        </div>
      </div>
      <VerifyAccount email={email} is_open={open} onOpenChange={setOpen} />
    </div>
  );
}
