// src/lib/utils.ts
import * as XLSX from "xlsx";


import { supabase } from "@/lib/supabase";

export const checkAndRenewPOs = async () => {
  const now = new Date().toISOString();

  // Fetch POs that need renewal
  const { data: posToRenew, error } = await supabase
    .from("pos")
    .select("*")
    .lte("next_renewal_date", now);

  if (error) {
    console.error("Error fetching POs to renew:", error);
    return;
  }

  // Duplicate POs for renewal
  for (const po of posToRenew) {
    const { data: newPO, error: renewalError } = await supabase
      .from("pos")
      .insert([
        {
          po_number: `${po.po_number}-RENEWED`,
          type: po.type,
          vendor_id: po.vendor_id,
          amount: po.amount,
          status: "Not Raised",
          renewal_period: po.renewal_period,
          next_renewal_date: calculateNextRenewalDate(po.renewal_period),
        },
      ]);

    if (renewalError) {
      console.error("Error renewing PO:", renewalError);
    } else {
      console.log("Renewed PO:", newPO);
    }
  }
};

const calculateNextRenewalDate = (period: string) => {
  const now = new Date();
  switch (period) {
    case "Monthly":
      return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    case "Quarterly":
      return new Date(now.setMonth(now.getMonth() + 3)).toISOString();
    case "Half-Yearly":
      return new Date(now.setMonth(now.getMonth() + 6)).toISOString();
    case "Annually":
      return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
    default:
      return now.toISOString();
  }
};

export const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };