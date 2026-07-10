import { motion } from "framer-motion";

export default function GradientButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
}) {
  return (
    <motion.button
      whileHover={{
        y: -3,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative
        w-full
        overflow-hidden
        rounded-2xl
        bg-[#FF6B35]
        py-4
        font-semibold
        text-white
        shadow-[0_10px_35px_rgba(255,107,53,0.35)]
        transition-all
        duration-300
        hover:bg-[#ff7a4d]
        hover:shadow-[0_15px_45px_rgba(255,107,53,0.45)]
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      <motion.div
        animate={{
          x: ["-120%", "220%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-y-0 w-20 rotate-12 bg-white/20 blur-md"
      />

      <span className="relative z-10 flex items-center justify-center gap-3">
        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}

        {loading ? "Signing In..." : children}
      </span>
    </motion.button>
  );
}