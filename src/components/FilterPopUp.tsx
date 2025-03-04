// components/FilterPopup.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import { Filters } from "../types/types";

interface FilterPopupProps {
  onClose: () => void;
  onFilter: (filters: Filters) => void;
}

const FilterPopup = ({ onClose, onFilter }: FilterPopupProps) => {
  const [filters, setFilters] = useState<Filters>({
    estimate_number: "",
    po_number: "",
    invoice_number: "",
    title: "",
    amount: "",
    type: "",
    status: "",
    renewal_period: "",
    vendor_name: "",
    cost_centre_name: "",
    cost_element_name: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilter(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800/90 p-6 rounded-lg shadow-glow w-full max-w-2xl">
        <h2 className="text-xl font-bold text-orange-300 mb-6">Filter Purchase Orders</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="estimate_number"
            placeholder="Estimate Number"
            value={filters.estimate_number}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="po_number"
            placeholder="PO Number"
            value={filters.po_number}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="invoice_number"
            placeholder="Invoice Number"
            value={filters.invoice_number}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={filters.title}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={filters.amount}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={filters.type}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={filters.status}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="renewal_period"
            placeholder="Renewal Period"
            value={filters.renewal_period}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="vendor_name"
            placeholder="Vendor Name"
            value={filters.vendor_name}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="cost_centre_name"
            placeholder="Cost Centre"
            value={filters.cost_centre_name}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="cost_element_name"
            placeholder="Cost Element"
            value={filters.cost_element_name}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <div className="col-span-full flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterPopup;