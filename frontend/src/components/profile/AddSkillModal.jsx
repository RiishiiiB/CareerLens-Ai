import { useState } from "react";
import { addSkill } from "../../services/skillService";
import toast from "react-hot-toast";
const AddSkillModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    proficiency: "beginner",
    years_experience: 0,
  });

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addSkill(form);
      toast.success("Skill added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
        toast.error("Failed to add skill.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Add Skill
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Skill Name"
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <select
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
            value={form.proficiency}
            onChange={(e) =>
              setForm({
                ...form,
                proficiency: e.target.value,
              })
            }
          >
            <option>beginner</option>
            <option>intermediate</option>
            <option>advanced</option>
            <option>expert</option>
          </select>

          <input
            type="number"
            placeholder="Years of Experience"
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
            value={form.years_experience}
            onChange={(e) =>
              setForm({
                ...form,
                years_experience: Number(e.target.value),
              })
            }
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-700 px-5 py-2 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white"
            >
              Save
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;