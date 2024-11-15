const ChangePassword = ({
  setShowPasswordChangeModal,
}: {
  setShowPasswordChangeModal: (show: boolean) => void;
}) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg mt-4">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <button
        className="btn btn-error text-white px-4 py-2"
        onClick={() => setShowPasswordChangeModal(true)}
      >
        Change Password
      </button>
    </div>
  );
};

export default ChangePassword;
