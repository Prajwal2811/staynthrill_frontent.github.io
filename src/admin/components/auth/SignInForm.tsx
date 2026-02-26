import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Default Filled (You Can Remove If Needed)
  const [formData, setFormData] = useState({
    email: "superadmin@gmail.com",
    password: "123456",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  // ✅ Multiple Admin Users with Roles
  const ADMIN_USERS = [
    {
      id: 1,
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: "123456",
      role: "super_admin",
    },
    {
      id: 2,
      name: "Operations Admin",
      email: "operations@gmail.com",
      password: "123456",
      role: "operations_admin",
    },
    {
      id: 3,
      name: "Financial Admin",
      email: "finance@gmail.com",
      password: "123456",
      role: "financial_admin",
    },
    {
      id: 4,
      name: "Support Admin",
      email: "support@gmail.com",
      password: "123456",
      role: "support_admin",
    },
  ];

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setLoginError("");
  };

  // Validation
  const validate = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Find matching admin
    const user = ADMIN_USERS.find(
      (admin) =>
        admin.email === formData.email &&
        admin.password === formData.password
    );

    if (user) {
      // Save login state
      localStorage.setItem("isLoggedIn", "true");

      // Save full user object
      localStorage.setItem("adminUser", JSON.stringify(user));

      // Save role separately (optional)
      localStorage.setItem("adminRole", user.role);

      // Redirect
      navigate("/dashboard");
    } else {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div>
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Admin Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* Email */}
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Login Error */}
            {loginError && (
              <p className="text-sm text-red-500">{loginError}</p>
            )}

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <Link
                to="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <div>
              <Button className="w-full" size="sm" type="submit">
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
