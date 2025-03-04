"use client";
import { Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import POForm from "@/components/POForm";
import { getFilteredPurchaseOrders, exportPurchaseOrders } from "@/lib/api";
import FilterPopup from "@/components/FilterPopUp";
import { Filters } from "../../types/types";
import POList from "@/components/POList"; // Import your POList component

interface PurchaseOrder {
  id: number;
  estimate_number: string;
  po_number: string;
  invoice_number: string;
  title: string;
  amount: number;
  type: string;
  status: string;
  renewal_period: string;
  vendor_name: string;
  cost_centre_name: string;
  cost_element_name: string;
}

export default function DashboardPage() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "history">("upcoming");
  const [showPOForm, setShowPOForm] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isLoadingPOs, setIsLoadingPOs] = useState(false);

  const handleFilter = async (filters: Filters) => {
    try {
      const data = await getFilteredPurchaseOrders(activeTab, filters);
      setPurchaseOrders(data); // Update the state with the filtered data
    } catch (error) {
      console.error("Error fetching filtered purchase orders:", error);
    }
  };

  const handleExport = async () => {
    try {
      const filters = { filter: activeTab };
      await exportPurchaseOrders(filters);
    } catch (error) {
      console.error("Error exporting purchase orders:", error);
    }
  };

  const fetchPurchaseOrders = async () => {
    setIsLoadingPOs(true);
    try {
      const data = await getFilteredPurchaseOrders(activeTab, {});
      setPurchaseOrders(data);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setIsLoadingPOs(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login");
    } else if (session) {
      fetchPurchaseOrders();
    }
  }, [session, isLoading, router, activeTab]);

  const approvePO = async (id: string) => {
    try {
      const { error } = await supabase
        .from("purchase_orders")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;
      fetchPurchaseOrders(); // Refresh the list
    } catch (error) {
      console.error("Error approving PO:", error);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex-grow pt-24 pb-8">
      <div className="max-w-[70%] mx-auto pt-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-orange-300">Dashboard</h1>
        </div>

        {/* Filter Popup */}
        {showFilterPopup && (
          <FilterPopup
            onClose={() => setShowFilterPopup(false)}
            onFilter={handleFilter}
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-start items-center mb-4">
          <button
            onClick={() => setShowPOForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors mr-4"
          >
            Create Job
          </button>
          <button
            onClick={handleExport}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors mr-4"
          >
            Export
          </button>
          <button
            onClick={() => setShowFilterPopup(true)}
            className="bg-orange-600 text-white p-2 rounded hover:bg-orange-700 transition-colors"
            aria-label="Filter"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Tab Container */}
        <div className="bg-gray-800/90 p-1.5 rounded-lg mb-6 shadow-glow">
          <div className="flex gap-1">
            {(["active", "upcoming", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-orange-600 text-white rounded-lg"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {tab === "active"
                  ? "Active Jobs"
                  : tab === "upcoming"
                  ? "Upcoming Renewals"
                  : "History"}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gray-800/90 p-6 rounded-lg shadow-glow">
          {showPOForm && (
            <POForm onClose={() => setShowPOForm(false)} onSuccess={fetchPurchaseOrders} />
          )}

          {isLoadingPOs ? (
            <p className="text-gray-300">Loading...</p>
          ) : (
            <>
              {activeTab === "active" && (
                <POList
                  purchaseOrders={purchaseOrders}
                  emptyMessage="No active jobs found."
                />
              )}
              {activeTab === "upcoming" && (
                <POList
                  purchaseOrders={purchaseOrders}
                  emptyMessage="No upcoming renewals found."
                  showApproveButton={true}
                  onApprove={approvePO}
                />
              )}
              {activeTab === "history" && (
                <POList
                  purchaseOrders={purchaseOrders}
                  emptyMessage="No history found."
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}