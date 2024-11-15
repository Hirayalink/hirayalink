"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BarangayRequestPost {
  id: string;
  dateTime: string;
  area: string;
  barangayId: string;
  barangayName?: string;
  typeOfCalamity: string;
  batchNumber: number;
  donorIds: string[];
  controlNumbers: string[];
}

export default function SuccessStoryForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [barangayName, setBarangayName] = useState("");
  const [barangayRequestPosts, setBarangayRequestPosts] = useState<
    BarangayRequestPost[]
  >([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedPostArea, setSelectedPostArea] = useState(""); // State to hold selected post area
  const [selectedPostBatchNumber, setSelectedPostBatchNumber] = useState(""); // State to hold selected post batch number
  const [donorIds, setDonorIds] = useState("");

  // State to hold form data
  const [formData, setFormData] = useState({
    barangayNo: "",
    calamityName: "",
    controlNumber: "",
    transactionIds: "",
    batchNumber: "",
    numberOfRecipients: "",
    storyText: "",
    photo: null as File | null,
  });

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
      setBarangayName(data.barangayName);
      setBarangayRequestPosts(data.barangayRequestPosts);
      setFormData((prevData) => ({ ...prevData, barangayNo: data.barangayName }));
    } catch (error) {
      console.error("Error fetching barangay data and posts:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement; // Type assertion for files property
    if (name === "barangayRequestPost") {
        setSelectedPostId(value);
        const selectedPost = barangayRequestPosts.find(
            (post) => post.id === value
        );
        if (selectedPost) {
            setSelectedPostArea(selectedPost.area); // Set the area of the selected post
            if (selectedPost.batchNumber !== undefined) { // Check if batchNumber is defined
                setSelectedPostBatchNumber(selectedPost.batchNumber.toString()); // Set the batch number of the selected post
            } else {
                console.error("Batch number is undefined for the selected post.");
                setSelectedPostBatchNumber(""); // Reset if undefined
            }
            setFormData({
                ...formData,
                calamityName: selectedPost.typeOfCalamity,
                controlNumber: selectedPost.controlNumbers.join(", "),
                transactionIds: selectedPost.donorIds.join(", "), // Join the array with commas
            });
        } else {
            console.error("Selected post not found in barangayRequestPosts.");
            setSelectedPostArea(""); // Reset area if post is not found
            setSelectedPostBatchNumber(""); // Reset batch number if post is not found
        }
    } else if (name === "photo" && files && files.length > 0) {
        // Handle file input
        setFormData({ ...formData, photo: files[0] }); // Set the first file
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    try {
        const imageBase64 = formData.photo
            ? await convertToBase64(formData.photo)
            : null;

        const response = await fetch("/api/success-stories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId: selectedPostId,
                nameOfCalamity: formData.calamityName,
                controlNumber: formData.controlNumber,
                batchNumber: selectedPostBatchNumber,
                numberOfRecipients: formData.numberOfRecipients,
                storyText: formData.storyText,
                image: imageBase64,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Success story submitted successfully", result);
            setShowSuccessModal(true);

            // Reset form data
            setFormData({
                barangayNo: "",
                calamityName: "",
                controlNumber: "",
                transactionIds: "",
                batchNumber: "",
                numberOfRecipients: "",
                storyText: "",
                photo: null,
            });
            setSelectedPostId("");
            setSelectedPostArea("");
            setSelectedPostBatchNumber("");
        } else {
            const errorData = await response.json();
            console.error("Failed to submit success story:", errorData.error, errorData.details);
        }
    } catch (error) {
        console.error("Error submitting success story:", error);
    }
  };

  const handleRedirectToDashboard = () => {
    router.push('/admin/dashboard');
  };

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <div className="hero-background bg-cover max-h-[30rem] sticky top-0 z-10">
        <div className="py-10 text-center backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-white">
            Submit Success Story
          </h1>
        </div>
      </div>
      <div className="flex justify-center m-5">
        <div className="card outline outline-primary bg-base-100 w-full shadow-xl">
          <div className="card-title rounded-t-lg p-5 bg-primary text-center">
            <h2 className="text-white text-2xl">Fill in the details</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form-control gap-4">
              <div className="form-control">
                <label className="label" htmlFor="barangayNo">
                  Barangay
                </label>
                <input
                  className="input input-bordered input-primary"
                  id="barangayNo"
                  type="text"
                  name="barangayNo"
                  value={barangayName}
                  readOnly
                />
              </div>

              {/* Barangay Request Post Dropdown */}
              <div className="form-control">
                <label
                  className="label"
                  htmlFor="barangayRequestPost"
                >
                  Select Barangay Request Post
                </label>
                <select
                  className="select select-bordered select-primary"
                  id="barangayRequestPost"
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

              {/* Display Area of Selected Post */}
              <div className="form-control">
                <label className="label">
                  Area of Selected Post
                </label>
                <input
                  className="input input-bordered input-primary"
                  type="text"
                  value={selectedPostArea}
                  readOnly
                />
              </div>

              {/* Calamity Name */}
              <div className="form-control">
                <label
                  className="label"
                  htmlFor="calamityName"
                >
                  Name of the Calamity
                </label>
                <input
                  className="input input-bordered input-primary"
                  id="calamityName"
                  type="text"
                  name="calamityName"
                  value={formData.calamityName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Control Number */}
              <div className="form-control">
                <label
                  className="label"
                  htmlFor="controlNumber"
                >
                  Control Number of Barangay Post
                </label>
                <input
                  className="input input-bordered input-primary"
                  id="controlNumber"
                  type="text"
                  name="controlNumber"
                  value={formData.controlNumber}
                  readOnly
                />
              </div>

              {/* Transaction IDs */}
              <div className="form-control">
                <label
                  className="label"
                  htmlFor="transactionIds"
                >
                  Transaction IDs (Donor IDs)
                </label>
                <input
                  className="input input-bordered input-primary"
                  id="transactionIds"
                  type="text"
                  name="transactionIds"
                  value={formData.transactionIds}
                  readOnly
                />
              </div>

              {/* Batch Number */}
              <div className="form-control">
                <label
                  className="label"
                  htmlFor="batchNumber"
                >
                  Batch Number
                </label>
                <input
                  className="input input-bordered input-primary"
                  id="batchNumber"
                  type="text"
                  name="batchNumber"
                  value={selectedPostBatchNumber}
                  readOnly
                />
              </div>

              {/* Number of Recipients */}
              <div className="form-control">
                <label
                  className="label"
                  htmlFor="numberOfRecipients"
                >
                  Number of Recipients
                </label>
                <input
                  className="input input-bordered input-primary"
                  id="numberOfRecipients"
                  type="number"
                  name="numberOfRecipients"
                  value={formData.numberOfRecipients}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Story Text */}
              <div className="form-control">
                <label
                  className="label"
                  htmlFor="storyText"
                >
                  Success Story
                </label>
                <textarea
                  className="textarea textarea-bordered textarea-primary"
                  id="storyText"
                  name="storyText"
                  value={formData.storyText}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Upload Photo */}
              <div className="form-control">
                <label
                  className="label"
                  htmlFor="photo"
                >
                  Upload Photo
                </label>
                <input
                  className="file-input file-input-bordered file-input-primary"
                  id="photo"
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange} 
                  required
                />
              </div>

              <div className="flex justify-end mt-5">
                <button
                  className="btn btn-primary text-white"
                  type="submit"
                >
                  Submit Success Story
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <dialog className="modal modal-open">
          <div className="modal-box text-center bg-base-100">
            <div className="p-5">
              <h3 className="font-bold text-lg mb-4">Success!</h3>
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-success flex-shrink-0 h-16 w-16" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="py-4">Your success story has been submitted successfully!</p>
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
