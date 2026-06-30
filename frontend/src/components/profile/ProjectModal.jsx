import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../ui/Button";
import Input from "../ui/Input";

const ProjectModal = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tech_stack: "",
    project_url: "",
    repository_url: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        tech_stack: initialData.tech_stack
          ? initialData.tech_stack.join(", ")
          : "",
        project_url: initialData.project_url || "",
        repository_url: initialData.repository_url || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        tech_stack: "",
        project_url: "",
        repository_url: "",
        start_date: "",
        end_date: "",
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Project title is required.");
      return;
    }

    if (!form.repository_url.trim()) {
      toast.error("GitHub Repository is required.");
      return;
    }

    await onSubmit({
      ...form,
      tech_stack: form.tech_stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          {initialData ? "Edit Project" : "Add Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Project Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
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

          <Input
            label="Tech Stack"
            value={form.tech_stack}
            onChange={(e) =>
              setForm({
                ...form,
                tech_stack: e.target.value,
              })
            }
          />

          <Input
            label="GitHub Repository"
            placeholder="https://github.com/username/repository"
            value={form.repository_url}
            onChange={(e) =>
              setForm({
                ...form,
                repository_url: e.target.value,
              })
            }
          />

          <Input
            label="Live Project URL (Optional)"
            placeholder="https://example.com"
            value={form.project_url}
            onChange={(e) =>
              setForm({
                ...form,
                project_url: e.target.value,
              })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={form.start_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  start_date: e.target.value,
                })
              }
            />

            <Input
              type="date"
              label="End Date"
              value={form.end_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  end_date: e.target.value,
                })
              }
            />
          </div>

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

export default ProjectModal;