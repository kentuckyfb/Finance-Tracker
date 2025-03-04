"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/lib/supabase";
import CostCentreForm from "@/components/CostCentreForm";

export default function CostCentresPage() {
  const [costCentres, setCostCentres] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const session = useSession();

  const fetchCostCentres = async () => {
    console.log("Fetching cost centres...");
    const { data, error } = await supabase.from("cost_centres").select("*");

    if (error) {
      console.error("Error fetching cost centres:", error);
    } else {
      console.log("Cost Centres data:", data);
      setCostCentres(data);
    }
  };

  useEffect(() => {
    console.log("Session:", session);
    if (session) fetchCostCentres();
  }, [session]);

  // Handle cost centre deletion
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cost_centres").delete().eq("id", id);
    if (!error) fetchCostCentres(); // Refresh the list
  };

  return (
    <div className="w-[70%] mx-auto pt-24 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-300">Cost Centres</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Add Cost Centre
        </button>
      </div>
      {showForm && (
        <CostCentreForm onClose={() => setShowForm(false)} onSuccess={fetchCostCentres} />
      )}
      <div className="bg-gray-800/90 p-4 rounded-lg shadow-glow">
        <table className="w-full text-gray-300">
          <thead>
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {costCentres.map((costCentre) => (
              <tr key={costCentre.id} className="hover:bg-gray-700/50">
                <td className="p-2">{costCentre.name}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(costCentre.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}