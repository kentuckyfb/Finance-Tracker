// src/app/dashboard/pos/page.tsx
"use client"; // Add this line

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { exportToExcel } from "@/lib/utils";
import POForm from "@/components/POForm";

export default function POSPage() {
  const [pos, setPos] = useState<any[]>([]);
  const [showPOForm, setShowPOForm] = useState(false);
  useEffect(() => {
    const fetchPOs = async () => {
      const { data, error } = await supabase.from("pos").select("*");
      if (data) setPos(data);
    };

    fetchPOs();
  }, []);

  const handleExport = () => {
    exportToExcel(pos, "POs");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-500 mb-6">Purchase Orders</h1>
      <button
        onClick={handleExport} 
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Export to Excel
      </button>
      <POForm onClose={() =>  setShowPOForm(false)} />
    </div>
  );
}