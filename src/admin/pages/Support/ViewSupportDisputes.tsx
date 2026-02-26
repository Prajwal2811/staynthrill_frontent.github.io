import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Reuse Dispute interface
interface Dispute {
  id: number;
  disputeId: string;
  userName: string;
  userEmail: string;
  bookingFor: string;
  invoiceId: string;
  reason: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

const mockDisputes: Dispute[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  disputeId: `DIS${1000 + i}`,
  userName: `User ${i + 1}`,
  userEmail: `user${i + 1}@gmail.com`,
  bookingFor: i % 2 === 0 ? "Hotel Sunshine" : "Adventure Thrill Co.",
  invoiceId: `INV${1000 + i}`,
  reason: i % 2 === 0 ? "Double charge" : "Service not delivered",
  amount: Math.floor(Math.random() * 5000) + 100,
  status: ["Pending", "Approved", "Rejected"][i % 3] as
    | "Pending"
    | "Approved"
    | "Rejected",
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
}));

export default function ViewDispute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispute = mockDisputes.find((d) => d.id === Number(id));
  const [status, setStatus] = useState(dispute?.status || "Pending");

  if (!dispute) {
    return <div className="p-6 text-center text-red-600">Dispute not found</div>;
  }

  const handleApprove = () => {
    setStatus("Approved");
    alert(`Dispute ${dispute.disputeId} approved`);
  };

  const handleReject = () => {
    setStatus("Rejected");
    alert(`Dispute ${dispute.disputeId} rejected`);
  };

  return (
    <div>
      <PageMeta title={`Dispute ${dispute.disputeId}`} description="View dispute details" />
      <PageBreadcrumb pageTitle={`Dispute ${dispute.disputeId}`} />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="max-w-8xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-700">
        <h2 className="text-2xl font-semibold dark:text-white mb-4">{dispute.bookingFor}</h2>

        <div className="mb-4">
          <p><strong>User:</strong> {dispute.userName} ({dispute.userEmail})</p>
          <p><strong>Invoice ID:</strong> {dispute.invoiceId}</p>
          <p><strong>Reason:</strong> {dispute.reason}</p>
          <p><strong>Amount:</strong> ${dispute.amount.toFixed(2)}</p>
          <p><strong>Date:</strong> {dispute.date}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                status === "Approved"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : status === "Rejected"
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              }`}
            >
              {status}
            </span>
          </p>
        </div>

        {status === "Pending" && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
