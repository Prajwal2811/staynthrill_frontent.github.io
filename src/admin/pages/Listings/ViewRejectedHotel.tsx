import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Hotel {
  id: number;
  hotelId: string;
  vendorId: string;
  name: string;
  location: string;
  category: string;
  pricePerNight: number;
  status: "approved" | "rejected";
}

export default function ViewRejectedHotel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setHotel({
      id: Number(id),
      hotelId: `HTL${3000 + Number(id)}`,
      vendorId: `VND${700 + Number(id)}`,
      name: `Hotel ${id}`,
      location: ["Mumbai", "Delhi", "Goa", "Jaipur"][Number(id) % 4],
      category: ["Luxury", "Budget", "Resort", "Boutique"][Number(id) % 4],
      pricePerNight: 3500 + Number(id) * 200,
      status: "rejected", // ✅ Default Rejected
    });
  }, [id]);

  if (!hotel) return <div className="p-6">Loading...</div>;

  const handleStatusUpdate = () => {
    const newStatus =
      hotel.status === "rejected" ? "approved" : "rejected";

    setHotel({ ...hotel, status: newStatus });
    setShowModal(false);

    toast.success(
      `Hotel ${
        newStatus === "approved" ? "Approved" : "Rejected"
      } Successfully`
    );
  };

  const getStatusColor = () => {
    switch (hotel.status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <div>
      <PageMeta title="Hotel Details" description="View Hotel Details" />
      <PageBreadcrumb pageTitle="Hotel Details" />
      <Toaster position="top-right" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Top Section */}
        <div className="mb-6">

          {/* First Row */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold dark:text-white">
                Hotel Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View complete information and update hotel status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${getStatusColor()}`}
              >
                {hotel.status}
              </span>

              {/* ✅ Update Status Button */}
              <button
                onClick={() => setShowModal(true)}
                className={`px-4 py-2 text-sm rounded-lg text-white transition ${
                  hotel.status === "rejected"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {hotel.status === "rejected"
                  ? "Approve Hotel"
                  : "Reject Hotel"}
              </button>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FiArrowLeft />
              Back
            </button>
          </div>
        </div>

        {/* Hotel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Hotel ID</p>
            <p className="font-medium">{hotel.hotelId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Vendor ID</p>
            <p className="font-medium">{hotel.vendorId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Hotel Name</p>
            <p className="font-medium">{hotel.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{hotel.location}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{hotel.category}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Price Per Night</p>
            <p className="font-medium text-blue-600">
              ₹{hotel.pricePerNight}
            </p>
          </div>

        </div>
      </div>

      {/* Status Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 shadow-xl">

            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Confirm Status Update
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {hotel.status === "rejected"
                  ? "approve"
                  : "reject"}
              </span>{" "}
              this hotel?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleStatusUpdate}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Yes, Confirm
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
