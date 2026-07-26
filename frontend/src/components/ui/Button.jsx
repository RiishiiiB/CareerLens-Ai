import { motion } from "framer-motion";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  loading = false,
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40",

    secondary:
      "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700",

    outline:
      "border border-blue-500 text-blue-400 hover:bg-blue-500/10",

    danger:
      "bg-gradient-to-r from-red-600 to-red-500 text-white hover:brightness-110",
  };

  return (
    <motion.button
      whileHover={{
        scale: disabled ? 1 : 1.03,
      }}
      whileTap={{
        scale: disabled ? 1 : 0.97,
      }}
      transition={{
        duration: 0.2,
      }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-5
        py-3
        font-semibold
        transition-all
        duration-300
        ${variants[variant]}
        ${
          disabled || loading
            ? "cursor-not-allowed opacity-60"
            : ""
        }
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;