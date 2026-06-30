import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../ui/Button";
import Input from "../ui/Input";

const EditProfileModal = ({
  open,
  onClose,
  profile,
  onSave,
}) => {
  const [form, setForm] = useState({
    headline: "",
    bio: "",
    location: "",
    portfolio_url: "",
    cgpa: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      headline: profile?.headline || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      portfolio_url: profile?.portfolio_url || "",
      cgpa: profile?.cgpa || "",
      date_of_birth: profile?.date_of_birth || "",
    });
  }, [open, profile]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSave(form);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Edit Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="Headline"
            value={form.headline}
            onChange={(e) =>
              setForm({
                ...form,
                headline: e.target.value,
              })
            }
          />

          <Input
            label="Bio"
            value={form.bio}
            onChange={(e) =>
              setForm({
                ...form,
                bio: e.target.value,
              })
            }
          />

          <Input
            label="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
          />

          <Input
            label="Portfolio URL"
            value={form.portfolio_url}
            onChange={(e) =>
              setForm({
                ...form,
                portfolio_url: e.target.value,
              })
            }
          />

          <Input
            type="number"
            label="CGPA"
            value={form.cgpa}
            onChange={(e) =>
              setForm({
                ...form,
                cgpa: e.target.value,
              })
            }
          />

          <Input
            type="date"
            label="Date of Birth"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({
                ...form,
                date_of_birth: e.target.value,
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;