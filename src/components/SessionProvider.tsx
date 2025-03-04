import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase"; // Import your Supabase client
import { getSession } from "@/lib/api";

interface SessionContextType {
  session: any; // Replace `any` with your session type
  userEmail: string | null;
  isLoading: boolean; // Add a loading state
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<any>(null); // Replace `any` with your session type
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const validateSession = async () => {
      try {
        setIsLoading(true); // Start loading
        const sessionData = await getSession(); // Call the backend to validate the session
        setSession(sessionData);
        setUserEmail(sessionData?.user?.email || null);
      } catch (error) {
        console.error("Session validation failed:", error);
        setSession(null);
        setUserEmail(null);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    validateSession();
  }, []);

  const value: SessionContextType = {
    session,
    userEmail,
    isLoading, // Include loading state in the context value
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};