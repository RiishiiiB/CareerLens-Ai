import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Card from "../ui/Card";
import Button from "../ui/Button";
import CertificationModal from "./CertificationModal";

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
              <div
                key={cert.id}
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
              >
                <div>
                  <h3 className="font-medium text-white">
                    {cert.name}
                  </h3>

                  <p className="text-slate-400">
                    {cert.issuing_organization}
                  </p>

                  <p className="text-sm text-slate-500">
                    {cert.issue_date}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedCertification(cert);
                      setOpen(true);
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(cert.id)}
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