import { useState, ChangeEvent, FormEvent } from "react";
import { Filters } from "../types/types";

interface FilterOptionsProps {
  onFilter: (filters: Filters) => void;
}

const FilterOptions = ({ onFilter }: FilterOptionsProps) => {
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
    onFilter(filters); // Pass the filters to the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-800/90 rounded-lg shadow-glow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add input fields for each filter */}
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
        {/* Add other input fields similarly */}
      </div>
      <button
        type="submit"
        className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
      >
        Apply Filters
      </button>
    </form>
  );
};

export default FilterOptions;