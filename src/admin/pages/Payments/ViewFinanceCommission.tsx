import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Commission {
  id: number;
  commissionId: string;
  userName: string;
  email: string;
  amount: number;
  date: string;
  type: "Sale" | "Referral" | "Bonus";
  status: "Paid" | "Pending" | "Cancelled";
}

export default function CommissionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock commissions (replace with API call)
  const [commissions] = useState<Commission[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      commissionId: `COM${1000 + index}`,
      userName: `User ${index + 1}`,
      email: `user${index + 1}@gmail.com`,
      amount: Math.floor(Math.random() * 2000) + 50,
      date: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString().split("T")[0],
      type: ["Sale", "Referral", "Bonus"][index % 3] as "Sale" | "Referral" | "Bonus",
      status: ["Paid", "Pending", "Cancelled"][index % 3] as "Paid" | "Pending" | "Cancelled",
    }))
  );

  const [commission, setCommission] = useState<Commission | null>(null);

  useEffect(() => {
    const found = commissions.find((c) => c.id === Number(id));
    if (!found) {
      navigate("/commissions"); // redirect if not found
    } else {
      setCommission(found);
    }
  }, [id, commissions, navigate]);

  if (!commission) return null;

  return (
    <div>
      <PageMeta title={`Commission ${commission.commissionId}`} description="View commission details" />
      <PageBreadcrumb pageTitle={`Commission ${commission.commissionId}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FiArrowLeft size={18} /> Back to Commissions
        </button>

        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Commission Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-medium">Commission ID</p>
            <p>{commission.commissionId}</p>
          </div>

          <div>
            <p className="font-medium">Vendor Name</p>
            <p>{commission.userName}</p>
          </div>

          <div>
            <p className="font-medium">Email</p>
            <p>{commission.email}</p>
          </div>

          <div>
            <p className="font-medium">Amount</p>
            <p>${commission.amount.toFixed(2)}</p>
          </div>

          <div>
            <p className="font-medium">Date</p>
            <p>{commission.date}</p>
          </div>

          <div>
            <p className="font-medium">Type</p>
            <p>{commission.type}</p>
          </div>

          <div>
            <p className="font-medium">Status</p>
            <span
              className={`px-3 py-1 text-xs rounded-full transition ${
                commission.status === "Paid"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : commission.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {commission.status}
            </span>
          </div>
        </div>

        {/* Optional extra section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium dark:text-white">Additional Info</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {/* Add more details if needed, e.g., transaction ID, remarks, payout method */}
            This is where you can show extra commission information like transaction ID, payout notes, or vendor remarks.
          </p>
        </div>
      </div>
    </div>
  );
}
