import SignInForm from "./form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign In",
};

export default function Page() {
  return <SignInForm />;
}
