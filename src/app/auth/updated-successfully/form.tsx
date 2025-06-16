"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

function UpdatedSuccessfullyForm() {
  function redirectToLogin() {
    redirect("sign-in");
  }
  return (
    <div className="flex gap-4 items-center justify-center h-full">
      <div className="main-card max-w-md flex items-center flex-col space-y-6">
        <div className="text-center mb-10">
          <div className="flex justify-center">
            <Image
              src="/images/updated-successfully.png"
              width={300}
              height={150}
              className="object-contain"
              alt="logo"
            />
          </div>
          <div className="flex justify-center flex-col px-6 mt-4">
            <h3 className="text-2xl mb-4 font-normal  text-black">
              Your successfully changed your password
            </h3>
            <p className="text-sm text-secondary">
              Always remember the password for your account at Africa Store !
            </p>
          </div>
        </div>
        <Button
          onClick={redirectToLogin}
          className="h-13 mt-3 rounded-full w-full"
        >
          Back to login
        </Button>
      </div>
    </div>
  );
}

export default UpdatedSuccessfullyForm;
