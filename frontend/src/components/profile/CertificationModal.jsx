import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const CertificationModal = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [form, setForm] = useState({
    name: "",
    issuing_organization: "",
    issue_date: "",
    expiry_date: "",
    credential_url: "",
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: initialData.name || "",
        issuing_organization:
          initialData.issuing_organization || "",
        issue_date: initialData.issue_date || "",
        expiry_date: initialData.expiry_date || "",
        credential_url:
          initialData.credential_url || "",
      });
    } else {
      setForm({
        name: "",
        issuing_organization: "",
        issue_date: "",
        expiry_date: "",
        credential_url: "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Certificate name is required.");
      return;
    }

    if (!form.issuing_organization.trim()) {
      toast.error("Issuing organization is required.");
      return;
    }

    if (!form.issue_date) {
      toast.error("Issue date is required.");
      return;
    }

    const payload = {
      name: form.name,
      issuing_organization: form.issuing_organization,
      issue_date: form.issue_date,
    };

    if (form.expiry_date.trim()) {
      payload.expiry_date = form.expiry_date;
    }

    if (form.credential_url.trim()) {
      payload.credential_url = form.credential_url;
    }

    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        initialData
          ? "Edit Certification"
          : "Add Certification"
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        <Input
          label="Certificate Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <Input
          label="Issuing Organization"
          value={form.issuing_organization}
          onChange={(e) =>
            setForm({
              ...form,
              issuing_organization: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            type="date"
            label="Issue Date"
            value={form.issue_date}
            onChange={(e) =>
              setForm({
                ...form,
                issue_date: e.target.value,
              })
            }
          />

          <Input
            type="date"
            label="Expiry Date (Optional)"
            value={form.expiry_date}
            onChange={(e) =>
              setForm({
                ...form,
                expiry_date: e.target.value,
              })
            }
          />
        </div>

        <Input
          label="Credential URL (Optional)"
          placeholder="https://example.com"
          value={form.credential_url}
          onChange={(e) =>
            setForm({
              ...form,
              credential_url: e.target.value,
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
};

export default CertificationModal;