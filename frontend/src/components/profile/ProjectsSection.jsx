import { useEffect, useState } from "react";
import { Plus} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../ui/Card";
import Button from "../ui/Button";
import ProjectModal from "./ProjectModal";
import ProjectCard from "./ProjectCard";
import EmptyState from "../ui/EmptyState";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, formData);
        toast.success("Project updated successfully!");
      } else {
        await addProject(formData);
        toast.success("Project added successfully!");
      }

      setOpen(false);
      setSelectedProject(null);
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      toast.success("Project deleted.");
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project.");
    }
  };

  return (
    <>
      <Card className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Projects
          </h2>

          <Button
            onClick={() => {
              setSelectedProject(null);
              setOpen(true);
            }}
          >
            <Plus size={18} />
            <span className="ml-2">Add Project</span>
          </Button>
        </div>

        <div className="space-y-4">
          {projects.length === 0 ? (
           
            <EmptyState
              title="No Projects"
             description="Showcase your projects to recruiters."
               />
          ) : (
            projects.map((project) => (
  <ProjectCard
    key={project.id}
    project={project}
    onEdit={() => {
      setSelectedProject(project);
      setOpen(true);
    }}
    onDelete={() => handleDelete(project.id)}
  />
))
          )}
        </div>
      </Card>

      <ProjectModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedProject}
      />
    </>
  );
};

export default ProjectsSection;