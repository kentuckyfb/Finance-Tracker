import { Filters } from '../types/types'; // Ensure this import path is correct

// Define types for the responses (adjust as needed)
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface SessionResponse {
  user: {
    id: string;
    email: string;
  };
}

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

interface PODetailsResponse extends PurchaseOrder {
  statusHistory: Array<{
    id: number;
    status: string;
    created_at: string;
  }>;
}

// Login function
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

// Get session function
export const getSession = async (): Promise<SessionResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/session', {
    method: 'GET',
    credentials: 'include', // Include cookies for session validation
  });

  if (!response.ok) {
    throw new Error('Session validation failed');
  }

  return response.json();
};

// Get filtered purchase orders function
export const getFilteredPurchaseOrders = async (filter: string, filters: Filters): Promise<PurchaseOrder[]> => {
  const queryParams = new URLSearchParams({
    filter,
    ...filters, // Spread the filter options into the query parameters
  });

  const response = await fetch(`http://localhost:5000/api/purchase-orders?${queryParams.toString()}`, {
    method: 'GET',
    credentials: 'include', // Include cookies for session validation
  });

  if (!response.ok) {
    throw new Error('Failed to fetch filtered purchase orders');
  }

  return response.json();
};

// Fetch vendors function
export const fetchVendors = async (): Promise<any[]> => {
  const response = await fetch(`http://localhost:5000/api/vendors`);
  if (!response.ok) throw new Error('Failed to fetch vendors');
  return response.json();
};

// Fetch cost centres function
export const fetchCostCentres = async (): Promise<any[]> => {
  const response = await fetch(`http://localhost:5000/api/cost-centres`);
  if (!response.ok) throw new Error('Failed to fetch cost centres');
  return response.json();
};

// Fetch cost elements function
export const fetchCostElements = async (): Promise<any[]> => {
  const response = await fetch(`http://localhost:5000/api/cost-elements`);
  if (!response.ok) throw new Error('Failed to fetch cost elements');
  return response.json();
};

// api.ts
export const exportPurchaseOrders = async (filters: Filters): Promise<void> => {
  // Remove undefined values from the filters object
  const definedFilters: Record<string, string> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) {
      definedFilters[key] = value.toString(); // Ensure the value is a string
    }
  }

  // Create URLSearchParams from the defined filters
  const queryParams = new URLSearchParams(definedFilters);

  const response = await fetch(`http://localhost:5000/api/purchase-orders/export?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to export purchase orders");
  }

  // Trigger download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "purchase_orders.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Fetch PO details function
export const fetchPODetails = async (poId: string): Promise<PODetailsResponse> => {
  const response = await fetch(`http://localhost:5000/api/purchase-orders/${poId}`, {
    method: 'GET',
    credentials: 'include', // Include cookies for session validation
  });

  if (!response.ok) {
    throw new Error('Failed to fetch PO details');
  }

  return response.json();
};