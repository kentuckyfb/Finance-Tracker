"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/SessionProvider";
import { fetchVendors, fetchCostCentres, fetchCostElements } from "@/lib/api";

export default function POForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [estimateNumber, setEstimateNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<"CAPEX" | "OPEX">("CAPEX");
  const [renewalPeriod, setRenewalPeriod] = useState<
    "NONE" | "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY"
  >("NONE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [costCentrename, setCostCentrename] = useState<string>(""); // Change to string
  const [costElementname, setCostElementname] = useState<string>(""); // Change to string
  const [vendors, setVendors] = useState<any[]>([]);
  const [costCentres, setCostCentres] = useState<any[]>([]);
  const [costElements, setCostElements] = useState<any[]>([]);
  const [error, setError] = useState("");
  const user = useSession(); // Get the logged-in user

  // Fetch vendors, cost centres, and cost elements
  useEffect(() => {
    const fetchData = async () => {
      const vendorsData = await fetchVendors();
      const costCentresData = await fetchCostCentres();
      const costElementsData = await fetchCostElements();

      setVendors(vendorsData);
      setCostCentres(costCentresData);
      setCostElements(costElementsData);
    };

    fetchData();
  }, []);

  // Calculate end date based on renewal period
  useEffect(() => {
    if (startDate && renewalPeriod !== "NONE") {
      const start = new Date(startDate);
      let end = new Date(start);

      switch (renewalPeriod) {
        case "MONTHLY":
          end.setMonth(start.getMonth() + 1);
          break;
        case "QUARTERLY":
          end.setMonth(start.getMonth() + 3);
          break;
        case "HALF_YEARLY":
          end.setMonth(start.getMonth() + 6);
          break;
        case "YEARLY":
          end.setFullYear(start.getFullYear() + 1);
          break;
        default:
          break;
      }

      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [startDate, renewalPeriod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to create a purchase order.");
      return;
    }


    const dataToInsert = {
      estimate_number: estimateNumber,
      title,
      description,
      amount: Number(amount), // Ensure amount is a number
      type,
      status: "NOT_RAISED", // Default status
      renewal_period: renewalPeriod,
      start_date: new Date(startDate).toISOString(), // Convert to ISO string
      end_date: new Date(endDate).toISOString(), // Convert to ISO string
      user_id: user.session?.user.id, // Use the logged-in user's ID
      vendor_name: vendorName,
      cost_centre_name: costCentrename ? String(costCentrename) : "", // Ensure it's a string
      cost_element_name: costElementname ? String(costElementname) : "", // Ensure it's a string
    };

    try {
      const response = await fetch(`http://localhost:5000/api/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToInsert),
      });

      if (!response.ok) throw new Error('Failed to create purchase order');

      alert("Purchase order created successfully!");
      onClose();
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCostCentreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCostCentrename(value); // No need to parse as number
  };

  const handleCostElementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCostElementname(value); // No need to parse as number
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-glow w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-orange-500/50">
          <h2 className="text-xl font-bold text-orange-300">Create New Purchase Order</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-orange-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Estimate Number and Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Estimate Number</label>
              <input
                type="text"
                value={estimateNumber}
                onChange={(e) => setEstimateNumber(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          {/* Amount and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "CAPEX" | "OPEX")}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="CAPEX">CAPEX</option>
                <option value="OPEX">OPEX</option>
              </select>
            </div>
          </div>

          {/* Renewal Period */}
          <div>
            <label className="block text-gray-300 mb-2">Renewal Period</label>
            <select
              value={renewalPeriod}
              onChange={(e) => setRenewalPeriod(e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="NONE">None</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="HALF_YEARLY">Half-Yearly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
                disabled={renewalPeriod !== "NONE"} // Disable if renewal period is set
              />
            </div>
          </div>

          {/* Vendor Name */}
          <div>
            <label className="block text-gray-300 mb-2">Vendor</label>
            <select
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
              required
            >
              <option value="">Select a vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.name}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Centre and Cost Element */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Cost Centre</label>
              <select
                value={costCentrename || ""}
                onChange={handleCostCentreChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
              >
                <option value="">Select a cost centre</option>
                {costCentres.map((cc) => (
                  <option key={cc.id} value={cc.name}> {/* Use `cc.name` instead of `cc.id` */}
                    {cc.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Cost Element</label>
              <select
                value={costElementname || ""}
                onChange={handleCostElementChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
              >
                <option value="">Select a cost element</option>
                {costElements.map((ce) => (
                  <option key={ce.id} value={ce.name}> {/* Use `ce.name` instead of `ce.id` */}
                    {ce.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-4 p-4 border-t border-orange-500/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:bg-gray-700/50 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Create PO
          </button>
        </div>
      </div>
    </div>
  );
}