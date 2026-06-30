import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import StatsGrid from "../components/dashboard/StatsGrid";
import HeroSection from "../components/dashboard/HeroSection";
import RecentActivity from "../components/dashboard/sections/RecentActivity";
import { getCurrentUser } from "../services/authService";
import { getStudentProfile } from "../services/studentService";
import RecommendationCard from "../components/dashboard/sections/RecommendationCard";
import UpcomingInterviews from "../components/dashboard/sections/UpcomingInterviews";

import { getSkills } from "../services/skillService";
import { getEducation } from "../services/educationService";
import { getProjects } from "../services/projectService";
import { getCertifications } from "../services/certificationService";

import { calculateProfileCompletion } from "../utils/profileCompletion";
import QuickActions from "../components/dashboard/sections/QuickActions";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
  userData,
  profileData,
  skills,
  education,
  projects,
  certifications,
] = await Promise.all([
  getCurrentUser(),
  getStudentProfile(),
  getSkills(),
  getEducation(),
  getProjects(),
  getCertifications(),
]);

        setUser(userData);
        setProfile(profileData);
        setCompletion(
  calculateProfileCompletion(
    profileData,
    skills,
    education,
    projects,
    certifications
  )
);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <DashboardLayout user={user}>
      <HeroSection user={user} profile={profile} completion={completion} />
      <div className="mt-8">
  
</div>
      <div className="mt-8">
        <StatsGrid profile={profile} />
      </div>
      <div className="mt-8">
        <RecentActivity />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <QuickActions />
        <RecommendationCard />
        <UpcomingInterviews />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;