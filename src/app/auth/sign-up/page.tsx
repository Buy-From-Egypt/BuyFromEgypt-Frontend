import SignUpForm from "./form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return <SignUpForm />;
}
