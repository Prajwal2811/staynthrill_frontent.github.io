import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Payment {
  id: number;
  paymentId: string;
  userName: string;
  email: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
}

export default function PaymentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data (same as PaymentHistory)
  const [payments] = useState<Payment[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      paymentId: `PAY${1000 + index}`,
      userName: `User ${index + 1}`,
      email: `user${index + 1}@gmail.com`,
      amount: Math.floor(Math.random() * 5000) + 100,
      date: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString().split("T")[0],
      status: ["Completed", "Pending", "Failed"][
        index % 3
      ] as "Completed" | "Pending" | "Failed",
    }))
  );

  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const found = payments.find((p) => p.id === Number(id));
    if (!found) {
      // Redirect or show error if payment not found
      navigate("/payments");
    } else {
      setPayment(found);
    }
  }, [id, payments, navigate]);

  if (!payment) return null;

  return (
    <div>
      <PageMeta title={`Payment ${payment.paymentId}`} description="View payment details" />
      <PageBreadcrumb pageTitle={`Payment ${payment.paymentId}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FiArrowLeft size={18} /> Back to Payments
        </button>

        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Payment Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-medium">Payment ID</p>
            <p>{payment.paymentId}</p>
          </div>

          <div>
            <p className="font-medium">User Name</p>
            <p>{payment.userName}</p>
          </div>

          <div>
            <p className="font-medium">Email</p>
            <p>{payment.email}</p>
          </div>

          <div>
            <p className="font-medium">Amount</p>
            <p>${payment.amount.toFixed(2)}</p>
          </div>

          <div>
            <p className="font-medium">Date</p>
            <p>{payment.date}</p>
          </div>

          <div>
            <p className="font-medium">Status</p>
            <span
              className={`px-3 py-1 text-xs rounded-full transition ${
                payment.status === "Completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : payment.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {payment.status}
            </span>
          </div>

          {/* You can add more fields like payment method, transaction ID, notes, etc. */}
        </div>
      </div>
    </div>
  );
}
