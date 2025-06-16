import Timeline from "@/components/main/timeline";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home",
};
export default function Page() {
  return <Timeline />;
}
