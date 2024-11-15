import { useState } from "react";
import ProfileField from "./ProfileField";

const PersonalInformation = ({
  profile,
  setProfile,
  setShowPasswordModal,
}: {
  profile: any;
  setProfile: (profile: any) => void;
  setShowPasswordModal: (show: boolean) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = async () => {
    setProfile(editedProfile); // Update local state first
    setShowPasswordModal(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
      {isEditing ? (
        <>
          <input
            className="input input-bordered input-primary w-full p-2 mb-2"
            name="name"
            value={editedProfile?.name || ""}
            onChange={handleChange}
          />
          <input
            className="input input-bordered input-primary w-full p-2 mb-2"
            name="orgName"
            value={editedProfile?.orgName || ""}
            onChange={handleChange}
            placeholder="Organization Name"
          />
          <input
            className="input input-bordered input-primary w-full p-2 mb-2"
            name="contactNumber"
            value={editedProfile?.contactNumber || ""}
            onChange={handleChange}
          />
          <input
            className="input input-bordered input-primary w-full p-2 mb-2"
            name="address"
            value={editedProfile?.address || ""}
            onChange={handleChange}
            placeholder="Address"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="btn btn-primary px-4 py-2 text-white"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="btn btn-warning px-4 py-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <ProfileField label="Name" value={profile.name} />
          <ProfileField
            label="Organization Name"
            value={profile.orgName || "Not provided"}
          />
          <ProfileField label="Contact Number" value={profile.contactNumber} />
          <ProfileField
            label="Address"
            value={profile.address || "Not provided"}
          />
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-primary px-4 py-2 text-white"
              onClick={handleEdit}
            >
              Edit Information
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalInformation;
