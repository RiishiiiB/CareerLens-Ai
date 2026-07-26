import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import Card from "../ui/Card";
import Button from "../ui/Button";
import EducationModal from "./EducationModal";
import EducationCard from "./EducationCard";
import EmptyState from "../ui/EmptyState";
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../../services/educationService";

const EducationSection = () => {
  const [education, setEducation] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      const data = await getEducation();
      setEducation(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedEducation) {
        await updateEducation(selectedEducation.id, formData);
        toast.success("Education updated successfully!");
      } else {
        await addEducation(formData);
        toast.success("Education added successfully!");
      }

      setOpen(false);
      setSelectedEducation(null);
      loadEducation();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education?")) return;

    try {
      await deleteEducation(id);
      toast.success("Education deleted.");
      loadEducation();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  return (
    <>
      <Card className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Education
          </h2>

          <Button
            onClick={() => {
              setSelectedEducation(null);
              setOpen(true);
            }}
          >
            <Plus size={18} />
            <span className="ml-2">Add Education</span>
          </Button>
        </div>

        <div className="space-y-4">
          {education.length === 0 ? (
           
            <EmptyState
                 title="No Education"
                  description="Add your educational qualifications."
                 />
          ) : (
            education.map((item) => (
  <EducationCard
    key={item.id}
    education={item}
    onEdit={() => {
      setSelectedEducation(item);
      setOpen(true);
    }}
    onDelete={() => handleDelete(item.id)}
  />
))
          )}
        </div>
      </Card>

      <EducationModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedEducation(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedEducation}
      />
    </>
  );
};

export default EducationSection;