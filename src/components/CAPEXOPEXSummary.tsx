// src/components/CAPEXOPEXSummary.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CAPEXOPEXSummary() {
    const [capexTotal, setCapexTotal] = useState(0);
    const [opexTotal, setOpexTotal] = useState(0);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchTotals = async () => {
        setLoading(true);
        const { data: capexData, error: capexError } = await supabase
          .from("pos")
          .select("amount")
          .eq("type", "CAPEX");
  
        const { data: opexData, error: opexError } = await supabase
          .from("pos")
          .select("amount")
          .eq("type", "OPEX");
  
        if (capexError || opexError) {
          console.error("Error fetching totals:", capexError || opexError);
        } else {
          setCapexTotal(capexData.reduce((sum, po) => sum + po.amount, 0));
          setOpexTotal(opexData.reduce((sum, po) => sum + po.amount, 0));
        }
        setLoading(false);
      };
  
      fetchTotals();
    }, []);
  
    if (loading) return <p>Loading...</p>;
  
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-orange-500 mb-4">CAPEX vs. OPEX Summary</h2>
        <div className="space-y-2">
          <p>Total CAPEX: ${capexTotal}</p>
          <p>Total OPEX: ${opexTotal}</p>
        </div>
      </div>
    );
  }