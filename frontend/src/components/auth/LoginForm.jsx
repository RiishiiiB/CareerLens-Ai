import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import InputField from "../ui/InputField";
import GradientButton from "../ui/GradientButton";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  loading,
  message,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-bold text-white">
        Welcome Back 👋
      </h2>

      <p className="mt-3 text-slate-400">
        Sign in to continue your AI career journey.
      </p>

      <div className="mt-10 space-y-6">

        <InputField
          label="Email"
          icon={Mail}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightIcon={
            showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )
          }
          onRightIconClick={() =>
            setShowPassword(!showPassword)
          }
        />

        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2 text-slate-400">

            <input
              type="checkbox"
              className="rounded border-slate-600 bg-slate-900"
            />

            Remember Me

          </label>

          <button
            type="button"
            className="text-blue-400 hover:text-blue-300"
          >
            Forgot Password?
          </button>

        </div>

        <GradientButton
          onClick={onLogin}
          loading={loading}
        >
          Sign In
        </GradientButton>

        {message && (
          <p className="text-center text-sm text-red-400">
            {message}
          </p>
        )}

        <p className="text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}