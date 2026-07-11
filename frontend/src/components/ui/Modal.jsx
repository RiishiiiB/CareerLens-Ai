import { X } from "lucide-react";

const Modal = ({
  open,
  title,
  children,
  maxWidth = "max-w-2xl",
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4">

      <div
        className={`
          relative
          mx-auto
          my-10
          w-full
          ${maxWidth}
          rounded-2xl
          border
          border-white/10
          bg-[#151515]
          shadow-2xl
        `}
      >

        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-white/10 bg-[#151515] px-6 py-5">

          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        <div
          className="
            max-h-[75vh]
            overflow-y-auto
            p-6
          "
        >
          {children}
        </div>

      </div>

    </div>
  );
};

export default Modal;