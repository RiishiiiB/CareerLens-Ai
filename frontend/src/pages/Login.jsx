import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import GlowBackground from "../components/ui/GlowBackground";
import GlassCard from "../components/ui/GlassCard";
import AuthHero from "../components/auth/AuthHero";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.tokens.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.data.tokens.refresh_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <GlowBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-2">

        <AuthHero />

        <GlassCard className="flex items-center justify-center p-10 lg:p-14">

          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            message={message}
            onLogin={handleLogin}
          />

        </GlassCard>

      </div>
    </div>
  );
}