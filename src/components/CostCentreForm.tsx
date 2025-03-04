"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CostCentreForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.from("cost_centres").insert([
      {
        name,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      onSuccess(); // Refresh the cost centres list
      onClose(); // Close the form
    }
  };

  return (
    <div className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/90 backdrop-blur-md p-8 rounded-lg shadow-glow w-96"
      >
        <h2 className="text-xl font-bold text-orange-300 mb-6">Add Cost Centre</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Cost Centre Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded"
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}