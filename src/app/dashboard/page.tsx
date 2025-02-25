"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/lib/supabase";
import POForm from "@/components/POForm";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "history">("upcoming"); // Default to "upcoming"
  const [showPOForm, setShowPOForm] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const session = useSession();

  // Fetch all purchase orders for the logged-in user
  const fetchPurchaseOrders = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*");

    if (error) {
      console.error("Error fetching purchase orders:", error);
    } else {
      console.log(data);
      setPurchaseOrders(data);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [session]);

  // Approve a PO
  const approvePO = async (id: string) => {
    const { error } = await supabase
      .from("purchase_orders")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Error approving PO:", error);
    } else {
      fetchPurchaseOrders(); // Refresh the list
    }
  };

  // Filter POs based on the active tab
  const getFilteredPOs = () => {
    const today = new Date();
    switch (activeTab) {
      case "active":
        return purchaseOrders.filter(
          (po) => po.status === "approved" && new Date(po.end_date) >= today
        );
      case "upcoming":
        return purchaseOrders.filter(
          (po) =>
            !po.status || // POs without a status
            po.status === "pending" || // POs with a status of "pending"
            (po.status === "approved" && new Date(po.end_date) >= today) // Approved POs that are still active
        );
      case "history":
        return purchaseOrders.filter(
          (po) =>
            po.status === "closed" || // Closed POs
            new Date(po.end_date) < today // POs past their end date
        );
      default:
        return [];
    }
  };

  return (
    <div className="flex-grow pt-24 pb-8">
      <div className="max-w-[70%] mx-auto pt-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-orange-300">Dashboard</h1>
          <button
            onClick={() => setShowPOForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Job
          </button>
        </div>

        {/* Tab Container */}
        <div className="bg-gray-800/90 p-1.5 rounded-lg mb-6 shadow-glow">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "bg-orange-500 text-white rounded-lg"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              Active Jobs
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "upcoming"
                  ? "bg-orange-500 text-white rounded-lg"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              Upcoming Renewals
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-orange-500 text-white rounded-lg"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gray-800/90 p-6 rounded-lg shadow-glow">
          {showPOForm && <POForm onClose={() => setShowPOForm(false)} onSuccess={fetchPurchaseOrders} />}
          {activeTab === "active" && (
            <POList
              purchaseOrders={getFilteredPOs()}
              emptyMessage="No active jobs found."
            />
          )}
          {activeTab === "upcoming" && (
            <POList
              purchaseOrders={getFilteredPOs()}
              emptyMessage="No upcoming renewals found."
              showApproveButton={true}
              onApprove={approvePO}
            />
          )}
          {activeTab === "history" && (
            <POList
              purchaseOrders={getFilteredPOs()}
              emptyMessage="No history found."
            />
          )}
        </div>
      </div>
    </div>
  );
}

// POList Component to display purchase orders in a table
const POList = ({
  purchaseOrders,
  emptyMessage,
  showApproveButton = false,
  onApprove,
}: {
  purchaseOrders: any[];
  emptyMessage: string;
  showApproveButton?: boolean;
  onApprove?: (id: string) => void;
}) => {
  if (purchaseOrders.length === 0) {
    return <p className="text-gray-300">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-gray-300">
        <thead>
          <tr>
            <th className="text-left p-2">PO Number</th>
            <th className="text-left p-2">Vendor</th>
            <th className="text-left p-2">Estimate Number</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Start Date</th>
            <th className="text-left p-2">End Date</th>
            <th className="text-left p-2">Status</th>
            {showApproveButton && <th className="text-left p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((po) => (
            <tr key={po.id} className="hover:bg-gray-700/50">
              <td className="p-2">{po.po_number}</td>
              <td className="p-2">{po.vendor_name}</td>
              <td className="p-2">{po.estimate_number}</td>
              <td className="p-2">${po.amount}</td>
              <td className="p-2">{new Date(po.start_date).toLocaleDateString()}</td>
              <td className="p-2">{new Date(po.end_date).toLocaleDateString()}</td>
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
              {showApproveButton && !po.status && (
                <td className="p-2">
                  <button
                    onClick={() => onApprove?.(po.id)}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition-colors"
                  >
                    Approve
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};