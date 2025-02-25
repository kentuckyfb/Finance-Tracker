"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/SessionProvider";

export default function POForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [estimateNumber, setEstimateNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<"CAPEX" | "OPEX">("CAPEX");
  const [renewalPeriod, setRenewalPeriod] = useState<
    "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY" | "NONE"
  >("MONTHLY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [error, setError] = useState("");
  const user = useSession(); // Get the logged-in user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to create a purchase order.");
      return;
    }

    const { error } = await supabase.from("purchase_orders").insert([
      {
        estimate_number: estimateNumber,
        title,
        description,
        amount,
        type,
        status: "NOT_RAISED", // Default status
        renewal_period: renewalPeriod,
        start_date: startDate,
        end_date: endDate,
        user_id: user.userEmail, // Use the logged-in user's ID
        vendor_name: vendorName, // Use vendor_name instead of vendor_id
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      alert("Purchase order created successfully!");
      onClose(); // Close the form
      onSuccess(); // Trigger the onSuccess callback
    }
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

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

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

          <div>
            <label className="block text-gray-300 mb-2">Renewal Period</label>
            <select
              value={renewalPeriod}
              onChange={(e) => setRenewalPeriod(e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="HALF_YEARLY">Half-Yearly</option>
              <option value="YEARLY">Yearly</option>
              <option value="NONE">None</option>
            </select>
          </div>

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
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Vendor Name</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
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