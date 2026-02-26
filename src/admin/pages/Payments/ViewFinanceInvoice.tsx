import { useParams, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FiArrowLeft, FiDownload, FiPrinter } from "react-icons/fi";

interface Invoice {
  id: number;
  invoiceId: string;
  userName: string;
  userEmail: string;
  bookingType: "Hotel" | "Adventure";
  bookingFor: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  participants?: number;
  amount: number;
  date: string;
  vendorName: string;
  vendorEmail: string;
  paymentMethod: string;
}

const mockInvoices: Invoice[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  invoiceId: `INV${1000 + i}`,
  userName: `John Doe ${i + 1}`,
  userEmail: `john${i + 1}@gmail.com`,
  bookingType: i % 2 === 0 ? "Hotel" : "Adventure",
  bookingFor: i % 2 === 0 ? "Hotel Sunshine" : "Adventure Thrill Co.",
  checkIn: i % 2 === 0 ? "2026-03-20" : undefined,
  checkOut: i % 2 === 0 ? "2026-03-22" : undefined,
  guests: i % 2 === 0 ? 2 : undefined,
  participants: i % 2 === 1 ? 4 : undefined,
  amount: Math.floor(Math.random() * 5000) + 100,
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  vendorName: i % 2 === 0 ? "Hotel Sunshine Admin" : "Adventure Thrill Vendor",
  vendorEmail: i % 2 === 0 ? "hotel@sunshine.com" : "adventure@thrillco.com",
  paymentMethod: i % 2 === 0 ? "Credit Card" : "PayPal",
}));

export default function InvoiceView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const invoice = mockInvoices.find((inv) => inv.id === Number(id));

  if (!invoice) {
    return (
      <div className="p-6 text-center text-red-600">
        Invoice not found
      </div>
    );
  }

  const handlePrint = () => window.print();
  const handleDownload = () =>
    alert(`Downloading invoice ${invoice.invoiceId}`);

  return (
    <div className="px-4 sm:px-6 py-6">
      <PageMeta
        title={`Invoice ${invoice.invoiceId}`}
        description="Invoice details"
      />
      <PageBreadcrumb pageTitle={`Invoice ${invoice.invoiceId}`} />

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 mt-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
              Stay<span className="text-blue-600">N</span>Thrill
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Booking System
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FiPrinter /> Print
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FiDownload /> Download
            </button>
          </div>
        </div>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <FiArrowLeft /> Back
        </button>

        {/* Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y py-6 mb-8">

          <div>
            <h3 className="text-lg font-semibold dark:text-white mb-2">
              Billed To
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {invoice.userName}
            </p>
            <p className="text-gray-500 text-sm">
              {invoice.userEmail}
            </p>
          </div>

          <div className="md:text-right">
            <h3 className="text-lg font-semibold dark:text-white mb-2">
              Invoice Details
            </h3>
            <p>
              Invoice ID:{" "}
              <span className="font-medium">{invoice.invoiceId}</span>
            </p>
            <p>Date: {invoice.date}</p>
            <p>Payment: {invoice.paymentMethod}</p>
          </div>

        </div>

        {/* Booking Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold dark:text-white mb-4">
            Booking Details
          </h3>

          <div className="overflow-x-auto border rounded-xl dark:border-gray-700">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3">Booking For</th>
                  <th className="px-4 py-3">
                    {invoice.bookingType === "Hotel"
                      ? "Check-in"
                      : "Participants"}
                  </th>
                  <th className="px-4 py-3">
                    {invoice.bookingType === "Hotel"
                      ? "Check-out"
                      : "Vendor Name"}
                  </th>
                  <th className="px-4 py-3">Vendor Email</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t dark:border-gray-700">
                  <td className="px-4 py-3">{invoice.bookingFor}</td>
                  <td className="px-4 py-3">
                    {invoice.bookingType === "Hotel"
                      ? invoice.checkIn
                      : invoice.participants}
                  </td>
                  <td className="px-4 py-3">
                    {invoice.bookingType === "Hotel"
                      ? invoice.checkOut
                      : invoice.vendorName}
                  </td>
                  <td className="px-4 py-3">{invoice.vendorEmail}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ${invoice.amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-gray-500 text-sm">Total Amount</p>
            <p className="text-2xl font-bold dark:text-white">
              ${invoice.amount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t pt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Thank you for booking with us. For any queries, contact
          support@example.com.
        </div>
      </div>
    </div>
  );
}