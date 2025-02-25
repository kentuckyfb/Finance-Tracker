"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/components/SessionProvider";
import  { supabase }   from "@/lib/supabase";
import VendorForm from "@/components/VendorForm";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const session = useSession();

  const fetchVendors = async () => {
    console.log("Fetching vendors...");
    const { data, error } = await supabase.from("vendors").select("*");
    
    if (error) {
      console.error("Error fetching vendors:", error);
    } else {
      console.log("Vendors data:", data);
      setVendors(data);
    }
  };

  useEffect(() => {
    console.log("Session:", session);
    if (session) fetchVendors();
  }, [session]);

  // Handle vendor deletion
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("vendors").delete().eq("id", id);
    if (!error) fetchVendors(); // Refresh the list
  };

  return (
    <div className="w-[70%] mx-auto pt-24 pb-24">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-orange-300">Vendors</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Add Vendor
        </button>
        
      </div>
      {showForm && (
        <VendorForm onClose={() => setShowForm(false)} onSuccess={fetchVendors} />
      )}
      <div className="bg-gray-800/90 p-4 rounded-lg shadow-glow">
        <table className="w-full text-gray-300">
          <thead>
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Contact Email</th>
              <th className="text-left p-2">Contact Phone</th>
              <th className="text-left p-2">Main POC</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-700/50">
                <td className="p-2">{vendor.name}</td>
                <td className="p-2">{vendor.contact_email}</td>
                <td className="p-2">{vendor.contact_phone}</td>
                <td className="p-2">{vendor.poc}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(vendor.id)}
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