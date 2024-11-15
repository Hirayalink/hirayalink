import { useState } from "react";
import Modal from "@/components/donor/changeInfoModal";

const ChangePasswordModal = ({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordChangeError("");
    setPasswordChangeSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `/api/donorProfile/${userId}/changePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (response.ok) {
        setPasswordChangeSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => {
          onClose();
          setPasswordChangeSuccess(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        setPasswordChangeError(
          errorData.message || "Failed to change password"
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordChangeError("An error occurred while changing the password");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {passwordChangeSuccess ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Password Changed Successfully!
          </h2>
          <p>Your password has been updated.</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <input
            type="password"
            className="input input-bordered input-primary w-full p-2 mb-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
          />
          <input
            type="password"
            className="input input-bordered input-primary w-full p-2 mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
          <input
            type="password"
            className="input input-bordered input-primary w-full p-2 mb-2"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm New Password"
          />
          {passwordChangeError && (
            <p className="text-red-500 mb-2">{passwordChangeError}</p>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="btn btn-primary px-4 py-2 text-white"
              onClick={handlePasswordChange}
            >
              Change Password
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

export default ChangePasswordModal;
