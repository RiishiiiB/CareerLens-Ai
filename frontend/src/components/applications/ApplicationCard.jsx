import {
  Edit,
  Trash2,
  MapPin,
  Briefcase,
  CalendarDays,
  IndianRupee,
  Building2,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
}) {
  return (
    <div className="group rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-blue-500/10">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          <div className="rounded-xl bg-blue-500/10 p-3">
            <Building2
              className="text-blue-400"
              size={22}
            />
          </div>

          <div>

            <h3 className="text-xl font-semibold text-white">
              {application.company_name}
            </h3>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">

              <div className="flex items-center gap-2">
                <Briefcase size={15} />
                {application.role}
              </div>

              {application.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={15} />
                  {application.location}
                </div>
              )}

            </div>

          </div>

        </div>

        <StatusBadge status={application.status} />

      </div>

      {/* Details */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        {application.package && (
          <div className="flex items-center gap-2 text-sm text-slate-300">

            <IndianRupee
              className="text-green-400"
              size={16}
            />

            <span>
              {application.package}
            </span>

          </div>
        )}

        {application.application_date && (
          <div className="flex items-center gap-2 text-sm text-slate-300">

            <CalendarDays
              className="text-cyan-400"
              size={16}
            />

            <span>
              {new Date(
                application.application_date
              ).toLocaleDateString()}
            </span>

          </div>
        )}

      </div>

      {/* Notes */}

      {application.notes && (
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/50 p-4">

          <p className="text-sm leading-6 text-slate-300">
            {application.notes}
          </p>

        </div>
      )}

      {/* Footer */}

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => onEdit(application)}
          className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-400 transition-all hover:bg-blue-500/20"
        >
          <Edit size={18} />
        </button>

        <button
          onClick={() => onDelete(application.id)}
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 transition-all hover:bg-red-500/20"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
}