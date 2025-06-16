import { Suspense } from "react";
import UpdatePassword from "./update-password";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePassword />
    </Suspense>
  );
}

