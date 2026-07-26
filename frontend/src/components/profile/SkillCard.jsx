import { motion } from "framer-motion";
import { Code2, Pencil, Trash2 } from "lucide-react";

const badgeStyles = {
  beginner: "bg-red-500/15 text-red-400 border-red-500/20",
  intermediate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  advanced: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  expert: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

const progressWidths = {
  beginner: "25%",
  intermediate: "50%",
  advanced: "75%",
  expert: "100%",
};

const SkillCard = ({ skill, onEdit, onDelete }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="
        rounded-2xl
        border
        border-slate-700/60
        bg-slate-900
        p-5
        transition-all
        duration-300
        hover:border-blue-500/40
        hover:shadow-xl
        hover:shadow-blue-500/10
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-400
            "
          >
            <Code2 size={22} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {skill.name}
            </h3>

            <span
              className={`
                mt-2
                inline-flex
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-semibold
                capitalize
                ${badgeStyles[skill.proficiency]}
              `}
            >
              {skill.proficiency}
            </span>
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

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">Experience</span>

          <span className="font-medium text-white">
            {skill.years_experience} Years
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
            style={{
              width: progressWidths[skill.proficiency] || "25%",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCard;