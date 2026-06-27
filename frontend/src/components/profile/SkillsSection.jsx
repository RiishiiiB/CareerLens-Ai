import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";
import AddSkillModal from "./AddSkillModal";
import toast from "react-hot-toast";
import { getSkills, deleteSkill } from "../../services/skillService";

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await deleteSkill(id);
      toast.success("Skill deleted.");
      loadSkills();
    } catch (err) {
      toast.error("Failed to delete skill.");
      console.error(err);
    }
  };

  return (
    <>
      <Card className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Skills
          </h2>

          <Button onClick={() => setOpen(true)}>
            <Plus size={18} />
            <span className="ml-2">Add Skill</span>
          </Button>
        </div>

        <div className="space-y-4">
          {skills.length === 0 ? (
            <p className="text-center text-slate-400">
              No skills added yet.
            </p>
          ) : (
            skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
              >
                <div>
                  <h3 className="font-medium text-white">
                    {skill.name}
                  </h3>

                  <p className="text-sm capitalize text-slate-400">
                    {skill.proficiency}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="text-blue-400 hover:text-blue-300">
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <AddSkillModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={loadSkills}
      />
    </>
  );
};

export default SkillsSection;