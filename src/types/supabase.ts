export type Vendor = {
    id: string; // UUID
    name: string;
    contact_email: string | null;
    contact_phone: string | null;
    created_at: string; // Timestamp
    poc: string | null;
  };
  
  export type Database = {
    public: {
      Tables: {
        vendors: {
          Row: Vendor;
          Insert: Omit<Vendor, "id" | "created_at">; // Exclude auto-generated fields
          Update: Partial<Vendor>; // Allow partial updates
        };
      };
    };
  };