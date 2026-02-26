import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface User {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!id) return;

    // Dummy Data (Replace with API later)
    setUser({
      id: Number(id),
      userId: `USR${1000 + Number(id)}`,
      firstName: `User${id}`,
      lastName: "Member",
      email: `user${id}@gmail.com`,
      role: "platform_user",
      status: Number(id) % 2 === 0 ? "active" : "inactive",
    });
  }, [id]);

  if (!user) return <div className="p-6">Loading...</div>;

  const getStatusColor = () => {
    return user.status === "active"
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div>
      <PageMeta title="User Details" description="View User Details" />
      <PageBreadcrumb pageTitle="User Details" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold dark:text-white">
            User Details
          </h2>

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

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">User ID</p>
            <p className="font-medium">{user.userId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">
              {user.role.replace("_", " ")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
            >
              {user.status}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
