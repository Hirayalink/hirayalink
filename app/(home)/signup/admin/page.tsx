'use client';

import { useState } from "react";
import { RiAdminFill } from "react-icons/ri";

export default function AdminSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    barangayName: "",
    contactNumber: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // For Terms of Service modal
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // For Privacy Policy modal

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (
      !formData.name ||
      !formData.contactNumber ||
      !formData.password ||
      !formData.barangayName
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/signup/admin", {
        method: "POST", // Ensure the method is POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup Successful: Redirecting to login.");
        window.location.href = "/login";
      } else {
        console.log(data.message);
        setError(data.message || "Sign up failed");
      }
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError("Something went wrong");
    }
  };

  // Function to toggle Terms of Service modal visibility
  const toggleModal = () => setShowModal(!showModal);

  // Function to toggle Privacy Policy modal visibility
  const togglePrivacyModal = () => setShowPrivacyModal(!showPrivacyModal);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-6 mb-5 rounded-lg shadow-lg min-w-sm w-full"
      >
        <h2 className="flex justify-center items-center text-2xl font-bold text-center mb-5 gap-2">
          <RiAdminFill className="text-center" /> Admin Sign-Up
        </h2>

        {error && <p className="text-alert mb-4">{error}</p>}

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            className="input input-bordered input-primary w-full"
            onChange={handleInputChange}
            required
            placeholder="First Name | Last Name" // Added placeholder
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Barangay Name</span>
          </label>
          <input
            type="text"
            name="barangayName"
            className="input input-bordered input-primary w-full"
            onChange={handleInputChange}
            required
            placeholder="ex: Barangay 20, Barangay Holy Spirit" // Added placeholder
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Contact Number</span>
          </label>
          <input
            type="text"
            name="contactNumber"
            className="input input-bordered input-primary w-full"
            onChange={handleInputChange}
            required
            placeholder="09123456789"
            maxLength={11}
            pattern="[0-9]*"
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
            placeholder="23 Malaya Street, Tondo, Manila" // Added placeholder
          />
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            className="input input-bordered input-primary w-full"
            onChange={handleInputChange}
            required
          />
        </div>

        <p className="text-center mb-5">
          By signing up, you agree to our{" "}
          <a
            href="#"
            className="text-primary cursor-pointer"
            onClick={toggleModal} // Opens Terms of Service modal
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-primary cursor-pointer"
            onClick={togglePrivacyModal} // Opens Privacy Policy modal
          >
            Privacy Policy
          </a>
        </p>

        <button type="submit" className="btn btn-primary text-white w-full">
          Sign Up
        </button>
      </form>

      {/* Modal for Terms of Service */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
            <div className="overflow-y-auto h-64 mb-4">
              {/* Terms of Service content */}
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
                contact us at hirayalink.2024@gmail.com.
              </p>
            </div>

            <button
              className="btn btn-primary text-white w-full"
              onClick={toggleModal} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Privacy Policy */}
      {showPrivacyModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <div className="overflow-y-auto h-64 mb-4">
              {/* Privacy Policy content */}
              <p>
                Your privacy is very important to us at HirayaLink. This privacy
                policy outlines how we collect, use, and protect your personal
                information.
              </p>
              <h3 className="font-semibold mt-2">1. Information We Collect</h3>
              <p>
                We collect information such as your name, contact number, and
                address to facilitate our donation process and ensure efficient
                communication.
              </p>
              <h3 className="font-semibold mt-2">
                2. How We Use Your Information
              </h3>
              <p>
                We use the collected data to manage donations, communicate with
                you about our services, and improve our platform.
              </p>
              <h3 className="font-semibold mt-2">3. Data Sharing</h3>
              <p>
                We do not share your personal information with third parties
                except as necessary to provide our services or as required by
                law.
              </p>
              <h3 className="font-semibold mt-2">4. Data Security</h3>
              <p>
                We take reasonable measures to protect your data from
                unauthorized access, loss, or misuse.
              </p>
              <h3 className="font-semibold mt-2">5. Changes to This Policy</h3>
              <p>
                We may update this policy as necessary. Significant changes will
                be communicated via email or a notification on our platform.
              </p>
              <h3 className="font-semibold mt-2">6. Contact Us</h3>
              <p>
                If you have any questions about this privacy policy, please
                contact us at hirayalink.2024@gmail.com.
              </p>
            </div>

            <button
              className="btn btn-primary text-white w-full"
              onClick={togglePrivacyModal} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}