import { useEffect, useState } from "react";
import {
  Upload,
  Download,
  Trash2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/layout/DashboardLayout";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

import { getCurrentUser } from "../services/authService";

import {
  getResumes,
  uploadResume,
  deleteResume,
  downloadResume,
} from "../services/resumeService";

const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const Resume = () => {
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);

      const resumes = await getResumes();

      if (resumes.length > 0) {
        setResume(resumes[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      await uploadResume(file);

      toast.success("Resume uploaded successfully!");

      loadResume();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

 const handleDelete = async () => {
  try {
    await deleteResume(resume.id);

    toast.success("Resume deleted.");

    setResume(null);
    setDeleteModalOpen(false);
  } catch (err) {
    console.error(err);
    toast.error("Delete failed.");
  }
};

  const handleDownload = async () => {
    try {
      const response = await downloadResume(resume.id);

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = resume.original_filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Download failed.");
    }
  };

  if (loading) {
    return (
      <h2 className="p-8 text-white">
        Loading...
      </h2>
    );
  }

  return (
    <DashboardLayout user={user}>
      <SectionTitle
        title="Resume Center"
        subtitle="Manage your professional resume."
      />

      <Card className="mt-6">
        {!resume ? (
          <div className="py-16 text-center">
            <Upload
              size={60}
              className="mx-auto mb-6 text-blue-500"
            />

            <h2 className="text-2xl font-semibold text-white">
              Upload Your Resume
            </h2>

            <p className="mt-3 text-slate-400">
              PDF only • Max 5 MB
            </p>

            <div className="mt-8">
              <label
                htmlFor="resume-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700"
              >
                <Upload size={20} />

                {uploading
                  ? "Uploading..."
                  : "Upload Resume"}
              </label>

              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                hidden
                onChange={handleUpload}
              />
            </div>
          </div>
        ) : (
                    <div className="space-y-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <div className="rounded-2xl bg-blue-500/10 p-5">
                    <FileText
                      size={42}
                      className="text-blue-500"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white break-all">
                      {resume.original_filename}
                    </h2>

                    <p className="mt-2 text-slate-400">
                      PDF Document
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                  Uploaded
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">
                    File Size
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    {formatFileSize(resume.file_size)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Uploaded On
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    {new Date(
                      resume.uploaded_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Format
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    PDF
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={handleDownload}>
                  <Download size={18} />
                  <span className="ml-2">
                    Download
                  </span>
                </Button>

                <label
                  htmlFor="replace-resume"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-600 bg-transparent px-4 py-2 font-medium text-white transition hover:bg-slate-800"
                >
                  <Upload size={18} />

                  Replace

                  <input
                    id="replace-resume"
                    hidden
                    type="file"
                    accept=".pdf"
                    onChange={handleUpload}
                  />
                </label>

                <Button
                  variant="danger"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 size={18} />
                  <span className="ml-2">
                    Delete
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
      <Modal
  open={deleteModalOpen}
  title="Delete Resume"
  maxWidth="max-w-md"
  onClose={() => setDeleteModalOpen(false)}
>
  <div className="space-y-6">

    <p className="text-slate-600">
      Are you sure you want to permanently delete your resume?
      This action cannot be undone.
    </p>

    <div className="flex justify-end gap-3">

      <Button
        variant="secondary"
        onClick={() => setDeleteModalOpen(false)}
      >
        Cancel
      </Button>

      <Button
        variant="danger"
        onClick={handleDelete}
      >
        Delete Resume
      </Button>

    </div>

  </div>
</Modal>
    </DashboardLayout>
  );
};

export default Resume;