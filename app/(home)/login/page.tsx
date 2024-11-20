"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaHandHoldingHeart } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaHandHolding } from "react-icons/fa";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    contactNumber: "",
    password: "",
    userType: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.contactNumber || !formData.password || !formData.userType) {
      setError("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        contactNumber: formData.contactNumber,
        password: formData.password,
        userType: formData.userType,
      });

      if (result?.ok) {
        if (formData.userType === "donor") {
          router.push("/donor");
        }
        if (formData.userType === "admin") {
          router.push("/admin");
        }
      } else {
        setError(result?.error || "Login failed");
      }
    } catch (error) {
      setError("Something went wrong");
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="card bg-neutral text-neutral-content min-w-min max-w-3xl">
        <div className="flex flex-row card-body">
          <div className="flex flex-col items-center">
            <h1 className="card-title text-center text-2xl font-bold mb-4">
              LOGIN
            </h1>
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                className={`btn btn-outline text-xl ${
                  formData.userType === "donor" ? "btn-active" : ""
                }`}
                onClick={() => setFormData({ ...formData, userType: "donor" })}
              >
                <FaHandHoldingHeart />
                Donor
              </button>
              <button
                type="button"
                className={`btn btn-outline text-xl ${
                  formData.userType === "admin" ? "btn-active" : ""
                }`}
                onClick={() => setFormData({ ...formData, userType: "admin" })}
              >
                <RiAdminFill />
                Admin
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row justify-center gap-4">
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Contact Number</span>
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    className="input input-bordered w-full"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="input input-bordered w-full"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-control mb-4">
                <button type="submit" className="btn btn-primary text-white w-full">
                  Login
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-5">
                Don&apos;t have an account?{" "}
                <a
                  onClick={() => router.push("/signup")}
                  className="font-semibold text-primary hover:text-accent"
                >
                  Sign up here.
                </a>
              </p>
            </form>
          </div>
          <div className="divider divider-primary divider-horizontal">or</div>
          <div className="flex flex-col items-center min-w-fit">
            <h1 className="card-title text-center text-2xl font-bold mb-4">
              REQUEST
            </h1>
            <a role="button" href="request" className="btn btn-outline text-xl">
              <FaHandHolding />
              <span>Recipient</span>
            </a>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral p-8 rounded-lg shadow-xl flex flex-col items-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg">Logging in...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral p-8 rounded-lg shadow-xl">
            <div className="flex flex-col items-center">
              <div className="text-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-4">Error</h3>
              <p className="text-center mb-4">{error}</p>
              <button 
                className="btn btn-primary text-white"
                onClick={() => setError("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
