import { useState } from "react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import { generateCompanyRecommendations } from "../services/aiService";
import CompanyHero from "../components/company/CompanyHero";
import CompanyStats from "../components/company/CompanyStats";
import CompanyCard from "../components/company/CompanyCard";
import CompanyFilter from "../components/company/CompanyFilter";
import EmptyCompaniesState from "../components/company/EmptyCompaniesState";
const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "AI Engineer",
  "Data Engineer",
  "DevOps Engineer",
];

export default function Companies() {
  const [role, setRole] = useState("");
  const [companies, setCompanies] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role) {
      toast.error("Please select a target role");
      return;
    }

    try {
      setLoading(true);

      const data = await generateCompanyRecommendations(role);

      setCompanies(data);

      toast.success("Company recommendations generated");
    } catch (error) {
  console.error(error);

  if (error.response?.status === 429) {
    toast.error("⚠️ AI quota exceeded. Please try again later.");
  } else {
    toast.error(
      error.response?.data?.detail ||
      "Failed to generate recommendations."
    );
  }
}
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
       <CompanyHero />

        <CompanyFilter
          role={role}
          setRole={setRole}
          roles={roles}
          loading={loading}
          onGenerate={handleGenerate}
        />

        {companies && (
          <>
            <CompanyStats companies={companies.companies}
            role={role} />
            <div className="grid gap-6 lg:grid-cols-2">
              {companies.companies.map((company) => (
                <CompanyCard
                  key={company.company}
                  company={company}
                />
              ))}
            </div>
          </>
        )}

        {!companies && (
          <EmptyCompaniesState />
        )}
      </div>
    </DashboardLayout>
  );
}