import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  open,
  title,
  children,
  maxWidth = "max-w-2xl",
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25 }}
            className={`
              relative
              w-full
              ${maxWidth}
              overflow-hidden
              rounded-3xl
              border
              border-slate-700/60
              bg-slate-900
              shadow-2xl
              shadow-blue-500/10
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-5 backdrop-blur">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Fill in the required information.
                </p>
              </div>

              <button
                onClick={onClose}
                className="
                  rounded-xl
                  p-2
                  text-slate-400
                  transition-all
                  duration-200
                  hover:bg-slate-800
                  hover:text-white
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;