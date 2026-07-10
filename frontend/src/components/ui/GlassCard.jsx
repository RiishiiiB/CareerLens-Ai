import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
      className={`
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-white/5
        bg-[#151515]/80
        backdrop-blur-3xl
        shadow-[0_30px_80px_rgba(0,0,0,0.6)]
        ${className}
      `}
    >
      <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-[#FF6B35]/10 via-transparent to-[#D9FF00]/5" />

      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#FF6B35]/40 to-transparent" />

      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D9FF00]/25 to-transparent" />

      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#FF6B35]/25 to-transparent" />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}