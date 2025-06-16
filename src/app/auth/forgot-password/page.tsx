import ForgotPasswordForm from "./form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function Page() {
  return <ForgotPasswordForm />;
}
