import { motion } from "framer-motion";

export default function GlowBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#090909]">

      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[#FF6B35]/25 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-10 h-[32rem] w-[32rem] rounded-full bg-[#D9FF00]/15 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, 80, -60, 0],
          y: [0, -60, 90, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[#FFD166]/15 blur-[110px]"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#090909_75%)]" />

      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

    </div>
  );
}