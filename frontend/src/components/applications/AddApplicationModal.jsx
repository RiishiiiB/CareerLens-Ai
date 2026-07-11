import { useState } from "react";
import applicationService from "../../services/applicationService";

const initialForm = {
  company_name: "",
  role: "",
  location: "",
  package: "",
  status: "Applied",
  applied_date: "",
  notes: "",
};

export default function AddApplicationModal({
  open,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await applicationService.createApplication(formData);

      setFormData(initialForm);

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#151515] shadow-2xl">

        <div className="sticky top-0 bg-[#151515] border-b border-white/10 px-8 py-6">
          <h2 className="text-3xl font-bold text-white">
            Add Application
          </h2>
          <p className="mt-2 text-slate-400">
            Track your placement applications.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-8"
        >

          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-[#1F1F1F] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          />

          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-[#1F1F1F] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#1F1F1F] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          />

          <input
            type="text"
            name="package"
            placeholder="Package (Eg. 18 LPA)"
            value={formData.package}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#1F1F1F] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#1F1F1F] px-4 py-3 text-white outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <input
            type="date"
            name="applied_date"
            value={formData.applied_date}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#1F1F1F] px-4 py-3 text-white outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          />

          <textarea
            rows="4"
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full resize-none rounded-xl border border-white/10 bg-[#1F1F1F] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
          />

          <div className="flex justify-end gap-4 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-700 px-6 py-3 font-medium text-white transition hover:bg-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#FF6B35] px-6 py-3 font-semibold text-white transition hover:bg-[#ff824f] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Application"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}