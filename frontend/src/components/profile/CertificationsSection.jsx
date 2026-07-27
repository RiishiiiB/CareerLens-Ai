import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import Card from "../ui/Card";
import Button from "../ui/Button";
import CertificationModal from "./CertificationModal";
import CertificationCard from "./CertificationCard";
import EmptyState from "../ui/EmptyState";
import {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
} from "../../services/certificationService";

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const data = await getCertifications();
      setCertifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCertification) {
        await updateCertification(selectedCertification.id, formData);
        toast.success("Certification updated successfully!");
      } else {
        await addCertification(formData);
        toast.success("Certification added successfully!");
      }

      setOpen(false);
      setSelectedCertification(null);
      loadCertifications();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certification?")) return;

    try {
      await deleteCertification(id);
      toast.success("Certification deleted.");
      loadCertifications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete certification.");
    }
  };

  return (
    <>
      <Card className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Certifications
          </h2>

          <Button
            onClick={() => {
              setSelectedCertification(null);
              setOpen(true);
            }}
          >
            <Plus size={18} />
            <span className="ml-2">Add Certification</span>
          </Button>
        </div>

        <div className="space-y-4">
          {certifications.length === 0 ? (
           
            <EmptyState
             title="No Certifications"
              description="Highlight your certifications and achievements."
                 />
          ) : (
          certifications.map((cert) => (
  <CertificationCard
    key={cert.id}
    certification={cert}
    onEdit={() => {
      setSelectedCertification(cert);
      setOpen(true);
    }}
    onDelete={() => handleDelete(cert.id)}
  />
))
          )}
        </div>
      </Card>

      <CertificationModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedCertification(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedCertification}
      />
    </>
  );
};

export default CertificationsSection;