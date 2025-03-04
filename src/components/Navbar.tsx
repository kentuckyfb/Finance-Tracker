"use client";


import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSession } from '@/components/SessionProvider';
import { useEffect } from "react";

export default function Navbar() {
  const { session, userEmail } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/login");
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[70%] bg-orange-800/90 backdrop-blur-md p-4 rounded-lg z-50 border border-orange-500/50 hover:border-orange-500 transition-all">

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-orange-300">PennyPincher</h1>
          <p className="text-gray-300">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center space-x-4">
          {pathname === "/dashboard/vendors" ||
            pathname === "/dashboard/cost-centres" ||
            pathname === "/dashboard/cost-elements" ||
            pathname === "/control-panel"? (
            <Link href="/dashboard">
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center space-x-2">
                <span>Back to Homepage</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </button>
            </Link>
          ) : (
            <Link href="/control-panel">
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center space-x-2">
                <span>Control Panel</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </button>
            </Link>
          )}
          {session && (
            <div className="flex items-center space-x-4">
              <p className="text-gray-300">{userEmail}</p>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-orange-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);

  if (session === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}