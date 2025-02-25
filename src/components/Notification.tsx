// src/components/Notification.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Notification({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) setNotifications(data);
    };

    fetchNotifications();
  }, [userId]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-orange-500 mb-2">Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className="text-gray-300">
          {notification.message}
        </div>
      ))}
    </div>
  );
}