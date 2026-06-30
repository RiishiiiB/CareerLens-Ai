import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../ui/Button";
import Input from "../ui/Input";

const EducationModal = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [form, setForm] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_year: "",
    end_year: "",
    grade: "",
    description: "",
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        institution: initialData.institution || "",
        degree: initialData.degree || "",
        field_of_study: initialData.field_of_study || "",
        start_year: initialData.start_year || "",
        end_year: initialData.end_year || "",
        grade: initialData.grade || "",
        description: initialData.description || "",
      });
    } else {
      setForm({
        institution: "",
        degree: "",
        field_of_study: "",
        start_year: "",
        end_year: "",
        grade: "",
        description: "",
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.institution.trim()) {
      toast.error("Institution is required.");
      return;
    }

    await onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          {initialData ? "Edit Education" : "Add Education"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Institution"
            value={form.institution}
            onChange={(e) =>
              setForm({ ...form, institution: e.target.value })
            }
          />

          <Input
            label="Degree"
            value={form.degree}
            onChange={(e) =>
              setForm({ ...form, degree: e.target.value })
            }
          />

          <Input
            label="Field of Study"
            value={form.field_of_study}
            onChange={(e) =>
              setForm({
                ...form,
                field_of_study: e.target.value,
              })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Start Year"
              value={form.start_year}
              onChange={(e) =>
                setForm({
                  ...form,
                  start_year: Number(e.target.value),
                })
              }
            />

            <Input
              type="number"
              label="End Year"
              value={form.end_year}
              onChange={(e) =>
                setForm({
                  ...form,
                  end_year: Number(e.target.value),
                })
              }
            />
          </div>

          <Input
            label="Grade / CGPA"
            value={form.grade}
            onChange={(e) =>
              setForm({ ...form, grade: e.target.value })
            }
          />

          <Input
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <div className="flex justify-end gap-3">
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
      </div>
    </div>
  );
};

export default EducationModal;