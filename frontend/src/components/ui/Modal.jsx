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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;