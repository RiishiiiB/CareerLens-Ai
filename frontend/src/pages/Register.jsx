import GlowBackground from "../components/ui/GlowBackground";
import GlassCard from "../components/ui/GlassCard";
import AuthHero from "../components/auth/AuthHero";
import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <GlowBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-2">

        <AuthHero />

        <GlassCard className="flex items-center justify-center p-10 lg:p-14">

          <RegisterForm />

        </GlassCard>

      </div>
    </div>
  );
}