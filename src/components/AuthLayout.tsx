"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
console.log("isAuthPage", isAuthPage);
  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? "pt-24 pb-24" : ""}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}