"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import PersonalInformation from "./PersonalInformation";
import ChangePassword from "./ChangePassword";
import DonationsTable from "./DonationsTable";
import ConfirmChangesModal from "./ConfirmChangesModal";
import ChangePasswordModal from "./ChangePasswordModal";

const Profile = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/donorProfile/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          } else {
            console.error("Failed to fetch profile");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [session]);

  if (status === "loading" || loading) return <Loading />;
  if (!profile) return <div>Failed to load profile</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center bg-primary text-white p-4 rounded-t-lg">
        Donor Profile
      </h1>
      <div className="flex flex-col md:flex-row gap-8 p-6">
        <div className="md:w-1/2 space-y-4">
          <PersonalInformation
            profile={profile}
            setProfile={setProfile}
            setShowPasswordModal={setShowPasswordModal}
          />
          <ChangePassword
            setShowPasswordChangeModal={setShowPasswordChangeModal}
          />
        </div>
        <div className="md:w-1/2">
          <DonationsTable donations={profile.donations} />
        </div>
      </div>
      <ConfirmChangesModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          window.location.reload();
        }}
        userId={session?.user?.id || ""}
        setProfile={setProfile}
        editedProfile={profile}
      />
      <ChangePasswordModal
        isOpen={showPasswordChangeModal}
        onClose={() => setShowPasswordChangeModal(false)}
        userId={session?.user?.id || ""}
      />
    </div>
  );
};

export default Profile;
