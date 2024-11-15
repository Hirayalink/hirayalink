import { useState, useRef } from "react";
import Modal from "@/components/donor/changeInfoModal";

const ConfirmChangesModal = ({
  isOpen,
  onClose,
  userId,
  setProfile,
  editedProfile,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  setProfile: (profile: any) => void;
  editedProfile: any;
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const passwordInputRef = useRef(null);

  const handleConfirmSave = async () => {
    try {
      const response = await fetch(`/api/donorProfile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...editedProfile, password }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSuccess(true);
        setPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred while updating the profile");
    }
  };

  const handleClose = () => {
    onClose();
    setSuccess(false);
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Changes Saved Successfully!
          </h2>
          <p className="mb-4">Your profile has been updated.</p>
          <button
            className="btn btn-primary px-4 py-2 text-white"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Confirm Changes</h2>
          <p className="mb-4">
            Please enter your password to confirm the changes:
          </p>
          <input
            type="password"
            className="input input-bordered input-primary w-full p-2 mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordInputRef}
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="btn btn-primary px-4 py-2 text-white"
              onClick={handleConfirmSave}
            >
              Confirm
            </button>
            <button className="btn btn-warning px-4 py-2" onClick={onClose}>
              Cancel
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConfirmChangesModal;
