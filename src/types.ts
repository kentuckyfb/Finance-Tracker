export interface PurchaseOrder {
  id: string;
  agency: string;
  estimate_number: string;
  price: number;
  start_date: string;
  end_date: string;
  deadline_date: string;
  estimate_due_date: string;
  estimate_start_date: string;
  status: 'draft' | 'pending' | 'approved' | 'closed';
  po_number: string | null;
  created_at: string;
}

export type NewPurchaseOrder = Omit<PurchaseOrder, 'id' | 'created_at' | 'po_number'>;