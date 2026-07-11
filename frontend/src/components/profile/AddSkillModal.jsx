import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function SkillModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    name: "",
    proficiency: "beginner",
    years_experience: 0,
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: initialData.name,
        proficiency: initialData.proficiency,
        years_experience: initialData.years_experience,
      });
    } else {
      setForm({
        name: "",
        proficiency: "beginner",
        years_experience: 0,
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    await onSubmit(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? "Edit Skill" : "Add Skill"}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        <Input
          label="Skill"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <Select
          label="Proficiency"
          value={form.proficiency}
          onChange={(e) =>
            setForm({
              ...form,
              proficiency: e.target.value,
            })
          }
          options={[
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
            { label: "Expert", value: "expert" },
          ]}
        />

        <Input
          type="number"
          label="Years of Experience"
          value={form.years_experience}
          onChange={(e) =>
            setForm({
              ...form,
              years_experience: Number(e.target.value),
            })
          }
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button type="submit">
            {initialData ? "Update" : "Add"}
          </Button>
        </div>

      </form>
    </Modal>
  );
}