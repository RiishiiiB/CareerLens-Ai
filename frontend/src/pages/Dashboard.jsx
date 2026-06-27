import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
// eslint-disable-next-line no-unused-vars
import WelcomeCard from "../components/dashboard/cards/WelcomeCard";
import StatsGrid from "../components/dashboard/StatsGrid";
import HeroSection from "../components/dashboard/HeroSection";
import RecentActivity from "../components/dashboard/sections/RecentActivity";
import { getCurrentUser } from "../services/authService";
import { getStudentProfile } from "../services/studentService";
import RecommendationCard from "../components/dashboard/sections/RecommendationCard";
import UpcomingInterviews from "../components/dashboard/sections/UpcomingInterviews";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userData, profileData] = await Promise.all([
          getCurrentUser(),
          getStudentProfile(),
        ]);

        setUser(userData);
        setProfile(profileData);
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
      <HeroSection user={user} profile={profile} />

      <div className="mt-8">
        <StatsGrid profile={profile} />
      </div>
      <div className="mt-8">
        <RecentActivity />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <RecommendationCard />
        <UpcomingInterviews />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;