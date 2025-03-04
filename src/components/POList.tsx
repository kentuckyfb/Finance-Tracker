// components/POList.tsx
"use client";

import { useState } from "react";
import POPopup from "@/components/POPopup";

interface POListProps {
  purchaseOrders: any[];
  emptyMessage: string;
  showApproveButton?: boolean;
  onApprove?: (id: string) => void;
}

export default function POList({
  purchaseOrders,
  emptyMessage,
  showApproveButton = false,
  onApprove,
}: POListProps) {
  const [selectedPOId, setSelectedPOId] = useState<string | null>(null);

  if (purchaseOrders.length === 0) {
    return <p className="text-gray-300">{emptyMessage}</p>;
  }

  const fetchPODetails = async (poId: string) => {
    try {
      const response = await fetch(`/api/purchase-orders/${poId}`);
      if (!response.ok) throw new Error("Failed to fetch PO details");
  
      const data = await response.json();
      return data; // This will include PO details and status history
    } catch (error) {
      console.error("Error fetching PO details:", error);
      return null;
    }
  };
  return (
    <div className="mt-6">
      {selectedPOId && (
        <POPopup poId={selectedPOId} onClose={() => setSelectedPOId(null)} />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-gray-300">
          <thead>
            <tr>
              <th className="text-left p-2">Estimate Number</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Cost Centre</th>
              <th className="text-left p-2">Cost Element</th>
              <th className="text-left p-2">Status</th>
              {showApproveButton && <th className="text-left p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <tr
                key={po.id}
                className="hover:bg-gray-700/50 cursor-pointer"
                onClick={() => setSelectedPOId(po.id)}
              >
                <td className="p-2">{po.estimate_number}</td>
                <td className="p-2">{po.title}</td>
                <td className="p-2">${po.amount}</td>
                <td className="p-2">{po.cost_centre_name}</td>
                <td className="p-2">{po.cost_element_name}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      po.status === "approved"
                        ? "bg-green-500/20 text-green-500"
                        : po.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {po.status || "Not Approved"}
                  </span>
                </td>
                {showApproveButton && (po.status === "approval" || po.status === "pending") && (
                  <td className="p-2">
                    <button
                      onClick={() => onApprove?.(po.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}