import { motion } from "framer-motion";

const Card = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        rounded-2xl
        border
        border-slate-800
        bg-gradient-to-br
        from-slate-900
        via-slate-900
        to-slate-950
        p-6
        shadow-lg
        shadow-black/20
        transition-all
        duration-300
        hover:border-blue-500/30
        hover:shadow-2xl
        hover:shadow-blue-500/10
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;