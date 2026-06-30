import { FolderOpen } from "lucide-react";

const EmptyState = ({
  title,
  description,
  action,
  icon: Icon = FolderOpen,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 py-12 text-center">

      <Icon
        size={48}
        className="mb-4 text-slate-500"
      />

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-slate-400">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}

    </div>
  );
};

export default EmptyState;