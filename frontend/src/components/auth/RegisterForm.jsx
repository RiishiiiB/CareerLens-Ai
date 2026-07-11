import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import InputField from "../ui/InputField";
import GradientButton from "../ui/GradientButton";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    if (
      !form.full_name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please fill all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
  toast.error("Passwords do not match.");
  return;
}

if (form.password.length < 8) {
  toast.error(
    "Password should be at least 8 characters."
  );
  return;
}
    try {
      setLoading(true);

      await api.post("/auth/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: "student",

        registration_number: "TEMP123",

        college_name: "CareerLens College",

        department: "",

        graduation_year: null,

        phone_number: "",

        linkedin_url: "",

        github_url: "",
      });

      toast.success("Account created successfully!");

      navigate("/");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.detail ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      <h1 className="text-4xl font-bold text-white">
        Create Account
      </h1>

      <p className="mt-2 mb-8 text-slate-400">
        Start your AI career journey.
      </p>

      <div className="space-y-6">

        <InputField
          label="Full Name"
          placeholder="John Doe"
          value={form.full_name}
          onChange={(e) =>
            update("full_name", e.target.value)
          }
        />

        <InputField
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(e) =>
            update("email", e.target.value)
          }
        />

        <InputField
  label="Password"
  type={showPassword ? "text" : "password"}
  placeholder="********"
  value={form.password}
  onChange={(e) =>
    update("password", e.target.value)
  }
  rightIcon={
    showPassword ? "🙈" : "👁"
  }
  onRightIconClick={() =>
    setShowPassword(!showPassword)
  }
/>
<InputField
  label="Confirm Password"
  type={
    showConfirmPassword
      ? "text"
      : "password"
  }
  placeholder="********"
  value={form.confirmPassword}
  onChange={(e) =>
    update(
      "confirmPassword",
      e.target.value
    )
  }
  rightIcon={
    showConfirmPassword ? "🙈" : "👁"
  }
  onRightIconClick={() =>
    setShowConfirmPassword(
      !showConfirmPassword
    )
  }
/>
<div className="space-y-2">

  <div className="h-2 rounded-full bg-slate-700">

    <div
      className={`h-2 rounded-full transition-all duration-300 ${
        form.password.length < 6
          ? "w-1/4 bg-red-500"
          : form.password.length < 10
          ? "w-2/4 bg-yellow-500"
          : "w-full bg-green-500"
      }`}
    />

  </div>

  <p className="text-sm text-slate-400">

    {form.password.length < 6 &&
      "Weak Password"}

    {form.password.length >= 6 &&
      form.password.length < 10 &&
      "Medium Password"}

    {form.password.length >= 10 &&
      "Strong Password"}

  </p>

</div>

        <GradientButton
          loading={loading}
          onClick={handleRegister}
        >
          Create Account
        </GradientButton>

        <p className="text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-orange-500 hover:text-orange-400"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}