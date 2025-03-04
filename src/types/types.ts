// types/types.ts
export interface Filters {
  filter?: string; // Make filter optional
  estimate_number?: string;
  po_number?: string;
  invoice_number?: string;
  title?: string;
  amount?: string;
  type?: string;
  status?: string;
  renewal_period?: string;
  vendor_name?: string;
  cost_centre_name?: string;
  cost_element_name?: string;
}