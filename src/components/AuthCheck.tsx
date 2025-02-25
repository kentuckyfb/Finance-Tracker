// components/AuthCheck.tsx
"use client";

import { usePathname } from "next/navigation";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return isAuthPage ? <>{children}</> : (
    <>
      {children}
    </>
  );
}