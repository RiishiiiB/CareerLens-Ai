import { Edit, Trash2, MapPin, Briefcase } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151515]/80 p-6 backdrop-blur-xl transition-all hover:border-[#FF6B35]/40 hover:shadow-lg hover:shadow-[#FF6B35]/10">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">
            {application.company_name}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-slate-400">
            <Briefcase size={16} />
            <span>{application.role}</span>
          </div>

          {application.location && (
            <div className="mt-2 flex items-center gap-2 text-slate-400">
              <MapPin size={16} />
              <span>{application.location}</span>
            </div>
          )}

          {application.package && (
            <p className="mt-3 text-sm text-[#FFD166]">
              💰 {application.package}
            </p>
          )}
        </div>

        <StatusBadge status={application.status} />
      </div>

      {application.notes && (
        <p className="mt-4 text-sm text-slate-400">
          {application.notes}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => onEdit(application)}
          className="rounded-lg bg-[#FF6B35]/10 p-2 text-[#FF6B35] transition hover:bg-[#FF6B35]/20"
        >
          <Edit size={18} />
        </button>

        <button
          onClick={() => onDelete(application.id)}
          className="rounded-lg bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}