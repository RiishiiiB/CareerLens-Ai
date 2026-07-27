import { motion } from "framer-motion";
import {
  User,
  Mail,
  Globe,
  Pencil,
  Briefcase,
  FileText,
} from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";

const ProfileHero = ({ user, profile, onEdit }) => {
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-transparent" />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        {/* Left */}
        <div className="flex gap-5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-blue-500
              to-cyan-500
              text-white
              shadow-lg
            "
          >
            <User size={38} />
          </motion.div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              {user?.full_name}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-slate-400">
              <Briefcase size={16} />
              <span>{profile?.headline || "Add a professional headline"}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                {user?.email}
              </div>

              {profile?.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <Globe size={16} />
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Button onClick={onEdit}>
          <Pencil size={18} />
          <span className="ml-2">Edit Profile</span>
        </Button>
      </div>

      {/* Bio */}
      <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="mb-3 flex items-center gap-2 text-white">
          <FileText size={18} />
          <h3 className="font-semibold">About Me</h3>
        </div>

        <p className="leading-7 text-slate-400">
          {profile?.bio ||
            "Tell recruiters about yourself, your interests, and your career goals."}
        </p>
      </div>
    </Card>
  );
};

export default ProfileHero;