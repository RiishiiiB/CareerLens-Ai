import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

import { getCurrentUser } from "../services/authService";
import applicationService from "../services/applicationService";

import ApplicationCard from "../components/applications/ApplicationCard";
import AddApplicationModal from "../components/applications/AddApplicationModal";
import ApplicationStats from "../components/applications/ApplicationStats";

export default function Applications() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);

      await fetchApplications();
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchApplications() {
    try {
      setLoading(true);

      const data =
        await applicationService.getApplications();

      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this application?"))
      return;

    try {
      await applicationService.deleteApplication(id);

      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredApplications =
    applications.filter((application) => {
      const matchesSearch =
        application.company_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        application.role
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen p-8">

        <ApplicationStats
          applications={applications}
        />

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-white">
              My Applications
            </h1>

            <p className="mt-2 text-slate-400">
              Track all your placement applications.
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />

            Add Application
          </button>

        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-[#151515] py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none"
          >
            <option>All</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

        </div>

        {loading ? (
          <p className="text-slate-400">
            Loading...
          </p>
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 py-20 text-center">

            <h2 className="text-2xl font-bold text-white">
              No Applications Found
            </h2>

            <p className="mt-3 text-slate-400">
              Add your first application.
            </p>

          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredApplications.map(
              (application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onEdit={() => {}}
                  onDelete={handleDelete}
                />
              )
            )}

          </div>
        )}

        <AddApplicationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchApplications}
        />

      </div>
    </DashboardLayout>
  );
}