"use client";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import{ SessionProvider , useSession} from "@/components/SessionProvider";
import "./globals.css";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import AuthCheck from "@/components/AuthCheck";

import { metadata as importedMetadata } from "@/types/metadata";
import AuthLayout from "@/components/AuthLayout";

export { importedMetadata };

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-black text-gray-300`}>
        <SessionProvider>
          <AuthCheck>
            <AuthLayout>{children}</AuthLayout>
            

          </AuthCheck>
        </SessionProvider>
      </body>
    </html>
  );
};

