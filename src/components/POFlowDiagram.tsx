// src/components/POFlowDiagram.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const statuses = [
  "Not Raised",
  "PO Raising",
  "PO Received",
  "PO Sent to Vendor",
  "Invoice Received",
  "Invoice Sent to Finance",
  "Payment Released",
];

export default function POFlowDiagram({ poId }: { poId: string }) {
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    const fetchPOStatus = async () => {
      const { data, error } = await supabase
        .from("pos")
        .select("status")
        .eq("id", poId)
        .single();

      if (data) setCurrentStatus(data.status);
    };

    fetchPOStatus();
  }, [poId]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
      {statuses.map((status, index) => (
        <div key={status} className="flex items-center">
          <div
            className={`w-4 h-4 rounded-full ${
              currentStatus === status ? "bg-orange-500" : "bg-gray-600"
            }`}
          />
          {index < statuses.length - 1 && (
            <div className="w-16 h-1 bg-gray-600 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}