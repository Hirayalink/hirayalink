const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-2">
    <span className="font-semibold">{label}:</span> {value}
  </div>
);

export default ProfileField;
