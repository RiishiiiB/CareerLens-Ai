import { motion } from "framer-motion";
import {
  Award,
  CalendarDays,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";

const CertificationCard = ({ certification, onEdit, onDelete }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="
        group
        rounded-2xl
        border
        border-slate-700/60
        bg-slate-900
        p-6
        transition-all
        duration-300
        hover:border-blue-500/40
        hover:shadow-xl
        hover:shadow-blue-500/10
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-amber-500/10
              text-amber-400
            "
          >
            <Award size={28} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              {certification.name}
            </h3>

            <p className="mt-1 text-slate-400">
              {certification.issuing_organization}
            </p>

            {certification.issue_date && (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={16} />
                <span>{certification.issue_date}</span>
              </div>
            )}

            {certification.credential_url && (
              <a
                href={certification.credential_url}
                target="_blank"
                rel="noreferrer"
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-700
                  px-4
                  py-2
                  text-sm
                  text-slate-300
                  transition
                  hover:border-blue-500
                  hover:text-white
                "
              >
                <ExternalLink size={16} />
                View Credential
              </a>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-blue-500/10
              hover:text-blue-400
            "
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={onDelete}
            className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-red-500/10
              hover:text-red-400
            "
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificationCard;