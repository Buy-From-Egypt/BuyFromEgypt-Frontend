import { Metadata } from "next";
import OtpVerificationForm from "./form";
export const metadata: Metadata = {
  title: "Otp Verification",
};
export default function Page() {
  return <OtpVerificationForm />;
}
