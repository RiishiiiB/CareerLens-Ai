import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/layout/DashboardLayout";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import SkillsSection from "../components/profile/SkillsSection";
import EditProfileModal from "../components/profile/EditProfileModal";
import EducationSection from "../components/profile/EducationSection";
import ProjectsSection from "../components/profile/ProjectsSection";
import CertificationsSection from "../components/profile/CertificationsSection";
import { getCurrentUser } from "../services/authService";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../services/studentService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, []);

  const handleProfileUpdate = async (formData) => {
    try {
      await updateStudentProfile(formData);

      await loadProfile();

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
      throw error;
    }
  };

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

          <Button onClick={() => setOpenModal(true)}>
            Edit Profile
          </Button>
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
       <EducationSection />
      <ProjectsSection />
      <CertificationsSection />
      <EditProfileModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        profile={profile}
        onSave={handleProfileUpdate}
      />
    </DashboardLayout>
  );
};

export default Profile;