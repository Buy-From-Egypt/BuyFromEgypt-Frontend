import { Suspense } from "react";
import Marketplace from "./marketplace";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Marketplace />
    </Suspense>
  );
}