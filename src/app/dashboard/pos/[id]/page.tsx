// src/app/dashboard/pos/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import POFlowDiagram from "@/components/POFlowDiagram";
import Notification from "@/components/Notification";

export default function PODetailsPage({ params }: { params: { id: string } }) {
  const [po, setPO] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPO = async () => {
      const { data, error } = await supabase
        .from("pos")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPO(data);
      }
    };

    fetchPO();
  }, [params.id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!po) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-500 mb-6">PO Details</h1>
      <div className="space-y-4">
        <p>PO Number: {po.po_number}</p>
        <p>Type: {po.type}</p>
        <p>Amount: ${po.amount}</p>
        <p>Status: {po.status}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold text-orange-500 mb-4">Status Flow</h2>
        <POFlowDiagram poId={params.id} />
      </div>
      <Notification userId={po.created_by} />
    </div>
  );
}