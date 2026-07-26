import { motion } from "framer-motion";
import {
  GraduationCap,
  CalendarDays,
  Pencil,
  Trash2,
  Award,
} from "lucide-react";

const EducationCard = ({ education, onEdit, onDelete }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="
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
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-500/10
              text-blue-400
            "
          >
            <GraduationCap size={28} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">
              {education.degree}
            </h3>

            <p className="mt-1 text-slate-300">
              {education.field_of_study}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {education.institution}
            </p>
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

      <div className="mt-6 flex flex-wrap gap-6">

        <div className="flex items-center gap-2 text-slate-400">
          <CalendarDays size={18} />
          <span>
            {education.start_year} — {education.end_year}
          </span>
        </div>

        {education.grade && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-emerald-400">
            <Award size={18} />
            <span>{education.grade}</span>
          </div>
        )}

      </div>

      {education.description && (
        <p className="mt-5 leading-7 text-slate-400">
          {education.description}
        </p>
      )}
    </motion.div>
  );
};

export default EducationCard;