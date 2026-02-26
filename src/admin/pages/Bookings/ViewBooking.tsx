import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Booking {
  id: number;
  bookingId: string;
  customerName: string;
  email: string;
  serviceType: string;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
  phone?: string;
  notes?: string;
}

export default function ViewBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBooking = () => {
      const tempBooking: Booking = {
        id: Number(id),
        bookingId: `BK${2000 + Number(id)}`,
        customerName: `Customer ${id}`,
        email: `customer${id}@gmail.com`,
        serviceType: "Hotel Stay",
        bookingDate: "2026-02-15",
        status: "pending",
        phone: "+91 9876543210",
        notes: "Customer requested early check-in.",
      };
      setBooking(tempBooking);
    };

    fetchBooking();
  }, [id]);

  if (!booking) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading booking details...
      </p>
    );
  }

  const handleStatusChange = (newStatus: Booking["status"]) => {
    setBooking((prev) =>
      prev ? { ...prev, status: newStatus } : prev
    );
    toast.success(
      `Booking ${
        newStatus === "confirmed" ? "approved" : "rejected"
      } successfully`
    );
  };

  return (
    <div>
      <PageMeta title="View Booking" description="Booking Details" />
      <PageBreadcrumb pageTitle="View Booking" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Booking Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View and manage this booking
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-sm mb-6">
          <Info label="Booking ID" value={booking.bookingId} />
          <Info label="Customer Name" value={booking.customerName} />
          <Info label="Email" value={booking.email} />
          <Info label="Phone" value={booking.phone || "-"} />
          <Info label="Service Type" value={booking.serviceType} />
          <Info label="Booking Date" value={booking.bookingDate} />

          <div>
            <p className="text-gray-500">Status</p>
            <p
              className={`font-medium capitalize px-3 py-1 rounded-full ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {booking.status}
            </p>
          </div>

          {booking.notes && (
            <div className="md:col-span-2">
              <p className="text-gray-500">Customer Notes</p>
              <p className="font-medium">{booking.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleStatusChange("confirmed")}
            disabled={booking.status === "confirmed"}
            className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleStatusChange("cancelled")}
            disabled={booking.status === "cancelled"}
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/* Small reusable info component */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
