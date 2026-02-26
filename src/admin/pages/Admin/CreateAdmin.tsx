import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    note: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors: any = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Minimum 6 characters required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    console.log("Admin Data:", formData);

    setTimeout(() => {
      alert("Admin Created Successfully!");
      setLoading(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
        note: "",
      });
      setErrors({});
    }, 1000);
  };

  return (
    <div>
      <PageMeta title="Create Admin" description="Add new admin user" />
      <PageBreadcrumb pageTitle="Create Admin" />

      <div className="max-w-8xl mx-auto mt-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-2xl font-semibold mb-2 dark:text-white">
            Add New Admin
          </h2>
          <p className="text-gray-500 text-sm mb-6 dark:text-gray-400">
            Fill in the details below to create a new admin account.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* First Name */}
              <div>
                <label className="block mb-2 text-sm font-medium">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block mb-2 text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block mb-2 text-sm font-medium">Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block mb-2 text-sm font-medium">Confirm Password *</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Role */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                >
                  <option value="">Select Role</option>
                  <option value="operations_admin">Operations Admin</option>
                  <option value="financial_admin">Financial Admin</option>
                  <option value="support_admin">Support Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              {/* Note */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
