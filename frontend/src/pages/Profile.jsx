import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/layout/DashboardLayout";
import SectionTitle from "../components/ui/SectionTitle";

import ProfileHero from "../components/profile/ProfileHero";
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

     <ProfileHero
  user={user}
  profile={profile}
  onEdit={() => setOpenModal(true)}
/>

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