import { useEffect, useState } from "react";
import { fetchPODetails } from "@/lib/api";

interface POPopupProps {
  poId: string;
  onClose: () => void;
}

interface PODetails {
  id: number;
  estimate_number: string;
  title: string;
  amount: number;
  status: string;
  statusHistory: Array<{
    id: number;
    status: string;
    created_at: string;
  }>;
}

export default function POPopup({ poId, onClose }: POPopupProps) {
  const [poDetails, setPODetails] = useState<PODetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchPODetails(poId);
      setPODetails(data);
      setIsLoading(false);
    };

    fetchData();
  }, [poId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!poDetails) {
    return <p>Failed to load PO details.</p>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">PO Details</h2>
        <p>Estimate Number: {poDetails.estimate_number}</p>
        <p>Title: {poDetails.title}</p>
        <p>Amount: ${poDetails.amount}</p>
        <p>Status: {poDetails.status}</p>

        <h3 className="text-lg font-bold mt-4">Status History</h3>
        <ul>
          {poDetails.statusHistory.map((history) => (
            <li key={history.id}>
              {history.status} - {new Date(history.created_at).toLocaleString()}
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}