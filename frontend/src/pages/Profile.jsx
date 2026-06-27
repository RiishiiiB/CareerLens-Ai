import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SkillsSection from "../components/profile/SkillsSection";
import { getCurrentUser } from "../services/authService";
import { getStudentProfile } from "../services/studentService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [userData, profileData] = await Promise.all([
          getCurrentUser(),
          getStudentProfile(),
        ]);

        setUser(userData);
        setProfile(profileData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <h2 className="p-8 text-white">Loading...</h2>;
  }

  return (
    <DashboardLayout user={user}>
      <SectionTitle
        title="My Profile"
        subtitle="Manage your personal information."
      />

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {user?.full_name}
            </h2>

            <p className="mt-2 text-slate-400">
              {user?.email}
            </p>
          </div>

          <Button>Edit Profile</Button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-slate-400">Headline</p>
            <p className="text-white">
              {profile?.headline || "Not Added"}
            </p>
          </div>

          <div>
            <p className="text-slate-400">Bio</p>
            <p className="text-white">
              {profile?.bio || "Not Added"}
            </p>
          </div>

          <div>
            <p className="text-slate-400">LinkedIn</p>
            <p className="text-white">
              {profile?.linkedin_url || "Not Added"}
            </p>
          </div>

          <div>
            <p className="text-slate-400">GitHub</p>
            <p className="text-white">
              {profile?.github_url || "Not Added"}
            </p>
          </div>
        </div>
            </Card>

      <SkillsSection />

    </DashboardLayout>
  );
};

export default Profile;