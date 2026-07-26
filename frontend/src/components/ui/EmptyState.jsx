import { FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

const EmptyState = ({
  title,
  description,
  action,
  icon: Icon = FolderOpen,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-slate-700
        bg-gradient-to-br
        from-slate-900
        via-slate-900
        to-slate-800
        px-8
        py-14
        text-center
      "
    >
      <div
        className="
          mb-6
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-2xl
          bg-blue-500/10
          ring-1
          ring-blue-500/20
        "
      >
        <Icon
          size={40}
          className="text-blue-400"
        />
      </div>

      <h3 className="text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 max-w-md leading-7 text-slate-400">
        {description}
      </p>

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;