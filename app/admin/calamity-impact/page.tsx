"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BarangayRequestPost {
  id: string;
  area: string;
  barangayId: string;
  barangayName?: string;
  nameOfCalamity: string;
  dateTime: string;
  typeOfCalamity: string;
  batchNumber: string;
}

export default function CalamityImpactForm() {
  const { data: session } = useSession();
  const [barangayName, setBarangayName] = useState("");
  const [barangayRequestPosts, setBarangayRequestPosts] = useState<
    BarangayRequestPost[]
  >([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedPost, setSelectedPost] = useState<BarangayRequestPost | null>(
    null
  );

  // State to hold form data
  const [formData, setFormData] = useState({
    storyText: "",
    image: null as File | null,
  });

  const [barangayId, setBarangayId] = useState("");
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchBarangayDataAndPosts();
    }
  }, [session]);

  const fetchBarangayDataAndPosts = async () => {
    try {
      const response = await fetch("/api/success-stories");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to fetch data: ${errorData.error}, ${errorData.details}`
        );
      }
      const data = await response.json();
      setBarangayRequestPosts(data.barangayRequestPosts);
      setBarangayId(data.barangayId); // Set the barangayId from the fetched data
      setBarangayName(data.barangayName);
    } catch (error) {
      console.error("Error fetching barangay data and posts:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "barangayRequestPost") {
      setSelectedPostId(value);
      const selectedPost = barangayRequestPosts.find(
        (post) => post.id === value
      );
      setSelectedPost(selectedPost || null); // Update selectedPost based on the selected ID
    } else if (name === "photo" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const imageBase64 = formData.image
        ? await convertToBase64(formData.image)
        : null;

      const response = await fetch("/api/calamity-impact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barangayId,
          area: selectedPost?.area,
          nameOfCalamity: selectedPost?.typeOfCalamity,
          storyText: formData.storyText,
          createdAt: new Date().toISOString(),
          image: imageBase64,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setShowSuccessModal(true);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to submit calamity impact:",
          errorData.error,
          errorData.details
        );
      }
    } catch (error) {
      console.error("Error submitting calamity impact:", error);
    }
  };

  const resetForm = () => {
    setFormData({ storyText: "", image: null });
    setSelectedPostId("");
    setSelectedPost(null);
  };

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRedirectToDashboard = () => {
    router.push("/admin/dashboard");
  };

  return (
    <div>
      <div className="hero-background bg-cover max-h-[30rem] sticky top-0 z-20">
        <div className="py-10 text-center backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-white">
            Submit Calamity Impact
          </h1>
        </div>
      </div>
      <div className="flex justify-center m-10">
        <div className="card outline outline-primary bg-base-100 w-full shadow-xl">
          <div className="card-title rounded-t-xl p-5 bg-primary text-center">
            <h2 className="text-white text-2xl">Fill in the details</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form-control gap-4">
              {/* Barangay */}
              <div className="form-control">
                <label className="label">Barangay</label>
                <input
                  type="text"
                  value={barangayName}
                  readOnly
                  className="input input-bordered input-primary"
                />
              </div>

              {/* Barangay Request Post Dropdown */}
              <div className="form-control">
                <label className="label">Select Barangay Request Post</label>
                <select
                  className="select select-bordered select-primary w-full"
                  name="barangayRequestPost"
                  value={selectedPostId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a post</option>
                  {barangayRequestPosts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {`${post.dateTime} - ${post.area} - ${post.typeOfCalamity} - Batch: ${post.batchNumber}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area of Selected Post */}
              <div className="form-control">
                <label className="label">Area of Selected Post</label>
                <input
                  type="text"
                  value={selectedPost?.area || ""}
                  readOnly
                  className="input input-bordered input-primary"
                />
              </div>

              {/* Type of Calamity */}
              <div className="form-control">
                <label className="label">Type of Calamity</label>
                <input
                  type="text"
                  value={selectedPost?.typeOfCalamity || ""}
                  readOnly
                  className="input input-bordered input-primary"
                />
              </div>

              {/* Story Text */}
              <div className="form-control">
                <label className="label">Story Text</label>
                <textarea
                  className="textarea textarea-bordered textarea-primary"
                  name="storyText"
                  value={formData.storyText}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Upload Photo */}
              <div className="form-control">
                <label className="label">Upload Photo</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="file-input file-input-bordered file-input-primary"
                />
              </div>

              <div className="flex justify-end mt-5">
                <button type="submit" className="btn btn-primary text-white">
                  Submit Calamity Impact
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <dialog className="modal modal-open">
          <div className="modal-box text-center">
            <div className="p-5">
              <h3 className="font-bold text-lg mb-4">Success!</h3>
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-success flex-shrink-0 h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="py-4">
                Your calamity impact has been submitted successfully!
              </p>
              <div className="modal-action flex justify-center">
                <button
                  onClick={handleRedirectToDashboard}
                  className="btn btn-primary text-white"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
