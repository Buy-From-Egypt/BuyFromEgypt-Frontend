import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Update Password",
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
