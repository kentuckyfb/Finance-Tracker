"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/lib/supabase";
import CostCentreForm from "@/components/CostCentreForm";
import CostElementForm from "@/components/CostElementForm";
import VendorForm from "@/components/VendorForm";

export default function ControlPanelPage() {
  const [costCentres, setCostCentres] = useState<any[]>([]);
  const [costElements, setCostElements] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [showCostCentreForm, setShowCostCentreForm] = useState(false);
  const [showCostElementForm, setShowCostElementForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const session = useSession();

  // Fetch all data
  const fetchCostCentres = async () => {
    const { data, error } = await supabase.from("cost_centres").select("*");
    if (error) console.error("Error fetching cost centres:", error);
    else setCostCentres(data);
  };

  const fetchCostElements = async () => {
    const { data, error } = await supabase
      .from("cost_elements")
      .select("*, cost_centres(name)");
    if (error) console.error("Error fetching cost elements:", error);
    else setCostElements(data);
  };

  const fetchVendors = async () => {
    const { data, error } = await supabase.from("vendors").select("*");
    if (error) console.error("Error fetching vendors:", error);
    else setVendors(data);
  };

  useEffect(() => {
    if (session) {
      fetchCostCentres();
      fetchCostElements();
      fetchVendors();
    }
  }, [session]);

  // Handle deletions
  const handleDeleteCostCentre = async (id: string) => {
    const { error } = await supabase.from("cost_centres").delete().eq("id", id);
    if (!error) fetchCostCentres();
  };

  const handleDeleteCostElement = async (id: string) => {
    const { error } = await supabase.from("cost_elements").delete().eq("id", id);
    if (!error) fetchCostElements();
  };

  const handleDeleteVendor = async (id: string) => {
    const { error } = await supabase.from("vendors").delete().eq("id", id);
    if (!error) fetchVendors();
  };

  return (
    <div className="w-[70%] mx-auto pt-24 pb-24 space-y-8">
      {/* Cost Centres Section */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-glow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-300">Cost Centres</h1>
          <button
            onClick={() => setShowCostCentreForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Add Cost Centre
          </button>
        </div>
        {showCostCentreForm && (
          <CostCentreForm
            onClose={() => setShowCostCentreForm(false)}
            onSuccess={fetchCostCentres}
          />
        )}
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
                    onClick={() => handleDeleteCostCentre(costCentre.id)}
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

      {/* Cost Elements Section */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-glow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-300">Cost Elements</h1>
          <button
            onClick={() => setShowCostElementForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Add Cost Element
          </button>
        </div>
        {showCostElementForm && (
          <CostElementForm
            onClose={() => setShowCostElementForm(false)}
            onSuccess={fetchCostElements}
          />
        )}
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
                    onClick={() => handleDeleteCostElement(costElement.id)}
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

      {/* Vendors Section */}
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-glow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-300">Vendors</h1>
          <button
            onClick={() => setShowVendorForm(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Add Vendor
          </button>
        </div>
        {showVendorForm && (
          <VendorForm
            onClose={() => setShowVendorForm(false)}
            onSuccess={fetchVendors}
          />
        )}
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
                    onClick={() => handleDeleteVendor(vendor.id)}
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