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
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4">
      <div className="mx-auto my-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#151515] shadow-2xl">

        <div className="border-b border-white/10 px-8 py-6">
          <h2 className="text-3xl font-bold text-white">
            Edit Profile
          </h2>

          <p className="mt-2 text-slate-400">
            Update your professional information.
          </p>
        </div>

        <form
  onSubmit={handleSubmit}
  className="max-h-[75vh] overflow-y-auto space-y-5 px-8 py-8"
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
            label="Portfolio / LinkedIn URL"
            placeholder="https://linkedin.com/in/yourname"
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

          <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
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