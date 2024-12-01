"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHandHoldingHeart, FaEye, FaEyeSlash } from "react-icons/fa";

export default function DonorSignUp() {
  const router = useRouter();

  // State variables for form and modals
  const [formData, setFormData] = useState({
    name: "",
    orgName: "",
    contactNumber: "",
    address: "",
    password: "",
    agreedToTerms: false,
  });

  const [error, setError] = useState("");

  // State variables to toggle modals
  const [showModal, setShowModal] = useState(false); // For Terms of Service modal
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // For Privacy Policy modal

  // Toggle functions for the modals
  const toggleModal = () => setShowModal(!showModal); // Toggle Terms of Service modal
  const togglePrivacyModal = () => setShowPrivacyModal(!showPrivacyModal); // Toggle Privacy Policy modal

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // State variable to track checkbox state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.contactNumber || !formData.password) {
      setError("Please fill all required fields");
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      setError("Please agree to both the Terms of Service and Privacy Policy");
      return;
    }

    try {
      const res = await fetch("/api/signup/donor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // Parse the response data

      if (res.ok) {
        alert("Signup Success: Redirect to login.");
        router.push("/login"); // Redirect on success
      } else {
        setError(data.message || "Sign up failed"); // Display error message from the backend
      }
    } catch (error) {
      setError("Something went wrong");
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="flex justify-center items-center mb-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-xl bg-base-100 p-6 rounded-lg shadow-lg"
      >
        <h2 className="flex justify-center items-center text-2xl font-bold text-center mb-5 gap-2">
          <FaHandHoldingHeart />
          <span>Donor SignUp</span>
        </h2>

        {error && <p className="text-error text-center mb-4">{error}</p>}

        {/* Form fields */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="form-control mb-4 w-full">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered input-primary w-full"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control mb-4 w-full">
            <label className="label">
              <span className="label-text">Contact Number</span>
            </label>
            <input
              type="text"
              name="contactNumber"
              className="input input-bordered input-primary w-full"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Organization Name</span>
          </label>
          <input
            type="text"
            name="orgName"
            className="input input-bordered input-primary w-full"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            type="text"
            name="address"
            className="input input-bordered input-primary w-full"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control mb-6 relative">
          <span className="flex">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <button
              type="button"
              className="cursor-pointer text-primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="input input-bordered input-primary w-full pr-10"
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Modal trigger links */}
        <div className="space-y-2 mb-5">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span className="label-text">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleModal();
                  }}
                >
                  Terms of Service
                </a>
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
              />
              <span className="label-text">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePrivacyModal();
                  }}
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary text-white w-full">
          Sign Up
        </button>
      </form>

      {/* Modal for Terms of Service */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
            <div className="overflow-y-auto h-64 mb-4">
              <p>
                Welcome to HirayaLink! By signing up and using our platform, you
                agree to the following terms and conditions:
              </p>

              <h3 className="font-semibold mt-2">1. Acceptance of Terms</h3>
              <p>
                By registering an account, you acknowledge that you have read,
                understood, and agree to abide by these terms and conditions.
              </p>

              <h3 className="font-semibold mt-2">2. User Responsibilities</h3>
              <p>
                Users must provide accurate information during registration and
                maintain the confidentiality of their account details.
              </p>

              <h3 className="font-semibold mt-2">3. Prohibited Activities</h3>
              <p>
                Users are prohibited from engaging in fraudulent activities,
                spreading false information, or misusing the platform in any
                way.
              </p>

              <h3 className="font-semibold mt-2">4. Privacy</h3>
              <p>
                Your information is protected and will be used in accordance
                with our Privacy Policy.
              </p>

              <h3 className="font-semibold mt-2">5. Liability</h3>
              <p>
                HirayaLink is not liable for the content posted by users or the
                misuse of donations.
              </p>

              <h3 className="font-semibold mt-2">6. Changes to Terms</h3>
              <p>
                HirayaLink reserves the right to modify these terms at any time.
                You will be notified of any significant changes.
              </p>

              <h3 className="font-semibold mt-2">7. Contact</h3>
              <p>
                If you have any questions regarding these terms, feel free to
                contact us at HirayaLink.2024@gmail.com.
              </p>
            </div>
            <button className="btn btn-primary text-white w-full" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Privacy Policy */}
      {showPrivacyModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <div className="overflow-y-auto h-64 mb-4">
              <p>
                Your privacy is important to us. This Privacy Policy explains
                how we collect, use, and share your information when you use
                HirayaLink.
              </p>

              <h3 className="font-semibold mt-2">1. Information We Collect</h3>
              <p>
                We collect information you provide directly, such as when you
                register, sign up for our service, or communicate with us.
              </p>

              <h3 className="font-semibold mt-2">
                2. How We Use Your Information
              </h3>
              <p>
                We use the information we collect to provide, maintain, and
                improve our services, and to communicate with you.
              </p>

              <h3 className="font-semibold mt-2">
                3. Sharing Your Information
              </h3>
              <p>
                We do not share your personal information with third parties
                except as required by law or to protect our rights.
              </p>

              <h3 className="font-semibold mt-2">4. Security</h3>
              <p>
                We take appropriate security measures to protect your
                information from unauthorized access or disclosure.
              </p>

              <h3 className="font-semibold mt-2">5. Changes to This Policy</h3>
              <p>
                We may update our Privacy Policy from time to time. Any changes
                will be posted on this page with an updated effective date.
              </p>

              <h3 className="font-semibold mt-2">6. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at HirayaLink.2024@gmail.com.
              </p>
            </div>
            <button
              className="btn btn-primary text-white w-full"
              onClick={togglePrivacyModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
