import { motion } from "framer-motion";
import {
  FolderGit2,
  Github,
  ExternalLink,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const technologies =
    project.tech_stack
      ?.split(",")
      .map((tech) => tech.trim())
      .filter(Boolean) || [];

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
              bg-blue-500/10
              text-blue-400
            "
          >
            <FolderGit2 size={28} />
          </div>

          <div>

            <div className="flex items-center gap-3">

              <h3 className="text-xl font-semibold text-white">
                {project.title}
              </h3>

              {project.featured && (
                <span
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-amber-500/10
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-amber-400
                  "
                >
                  <Star size={12} />
                  Featured
                </span>
              )}
            </div>

            <p className="mt-3 leading-7 text-slate-400">
              {project.description}
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

      {technologies.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="
                rounded-full
                bg-blue-500/10
                px-3
                py-1
                text-sm
                font-medium
                text-blue-400
              "
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">

        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-700
              px-4
              py-2
              text-slate-300
              transition
              hover:border-blue-500
              hover:text-white
            "
          >
            <Github size={18} />
            GitHub
          </a>
        )}

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              px-4
              py-2
              font-medium
              text-white
              transition
              hover:scale-105
            "
          >
            <ExternalLink size={18} />
            Live Demo
          </a>
        )}

      </div>
    </motion.div>
  );
};

export default ProjectCard;