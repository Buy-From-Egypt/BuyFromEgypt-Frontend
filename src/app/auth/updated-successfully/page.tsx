import { Metadata } from "next";
import UpdatedSuccessfullyForm from "./form";
export const metadata: Metadata = {
  title: "Updated Successfully",
};
export default function Page() {
  return <UpdatedSuccessfullyForm />;
}
