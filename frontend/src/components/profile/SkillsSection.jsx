import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import toast from "react-hot-toast";

import Card from "../ui/Card";
import Button from "../ui/Button";
import SkillModal from "./AddSkillModal";
import SkillCard from "./SkillCard";
import EmptyState from "../ui/EmptyState";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from "../../services/skillService";

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedSkill) {
        await updateSkill(selectedSkill.id, formData);
        toast.success("Skill updated successfully!");
      } else {
        await addSkill(formData);
        toast.success("Skill added successfully!");
      }

      setOpen(false);
      setSelectedSkill(null);
      loadSkills();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await deleteSkill(id);
      toast.success("Skill deleted.");
      loadSkills();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete skill.");
    }
  };

  return (
    <>
      <Card className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Skills
          </h2>

          <Button
            onClick={() => {
              setSelectedSkill(null);
              setOpen(true);
            }}
          >
            <Plus size={18} />
            <span className="ml-2">Add Skill</span>
          </Button>
        </div>

        <div className="space-y-4">
          {skills.length === 0 ? (
           
            <EmptyState
              title="No Skills"
                description="Add your first skill to strengthen your profile."
                  />
          ) : (
            skills.map((skill) => (
  <SkillCard
    key={skill.id}
    skill={skill}
    onEdit={() => {
      setSelectedSkill(skill);
      setOpen(true);
    }}
    onDelete={() => handleDelete(skill.id)}
  />
))
          )}
        </div>
      </Card>

      <SkillModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedSkill(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedSkill}
      />
    </>
  );
};

export default SkillsSection;