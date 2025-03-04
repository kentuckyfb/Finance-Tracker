"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/lib/supabase";
import CostElementForm from "@/components/CostElementForm";

export default function CostElementsPage() {
  const [costElements, setCostElements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const session = useSession();

  const fetchCostElements = async () => {
    console.log("Fetching cost elements...");
    const { data, error } = await supabase
      .from("cost_elements")
      .select("*, cost_centres(name)");

    if (error) {
      console.error("Error fetching cost elements:", error);
    } else {
      console.log("Cost Elements data:", data);
      setCostElements(data);
    }
  };

  useEffect(() => {
    console.log("Session:", session);
    if (session) fetchCostElements();
  }, [session]);

  // Handle cost element deletion
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cost_elements").delete().eq("id", id);
    if (!error) fetchCostElements(); // Refresh the list
  };

  return (
    <div className="w-[70%] mx-auto pt-24 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-300">Cost Elements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Add Cost Element
        </button>
      </div>
      {showForm && (
        <CostElementForm onClose={() => setShowForm(false)} onSuccess={fetchCostElements} />
      )}
      <div className="bg-gray-800/90 p-4 rounded-lg shadow-glow">
        <table className="w-full text-gray-300">
          <thead>
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Cost Centre</th>
              <th className="text-left p-2">Budget</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {costElements.map((costElement) => (
              <tr key={costElement.id} className="hover:bg-gray-700/50">
                <td className="p-2">{costElement.name}</td>
                <td className="p-2">{costElement.cost_centres?.name || "N/A"}</td>
                <td className="p-2">${costElement.budget}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(costElement.id)}
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