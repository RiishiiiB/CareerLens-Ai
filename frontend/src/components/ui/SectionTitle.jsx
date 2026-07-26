import { motion } from "framer-motion";

const SectionTitle = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8 flex items-center justify-between"
    >
      <div>
        <div className="mb-2 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />

        <h2 className="text-3xl font-bold tracking-tight text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SectionTitle;