"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import PhilippinesClock from "./PhilippinesClock";
import { FaUser, FaPhone, FaEnvelope, FaUsers, FaMapMarkerAlt, FaExclamationTriangle, FaFileUpload, FaCheckCircle } from "react-icons/fa";
import { MdChildCare } from "react-icons/md";

interface Barangay {
  id: string;
  name: string;
}

export default function DonationRequestPosting() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    familyMembers: "",
    contactNumber: "",
    email: "",
    barangayId: "",
    area: "",
    calamityType: "",
    necessities: [] as string[],
    specifyNecessities: {},
    proofFile: null as File | null,
    numberOfChildren: 0,
    ageGroupInfant: "",
    ageGroupEarlyChild: "",
    ageGroupMiddleChild: "",
    ageGroupAdolescent: "",
  });
  const [barangays, setBarangays] = useState<Barangay[]>([]); // Update the state definition
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        const response = await fetch("/api/barangays"); // Adjust the API endpoint as needed
        const data = await response.json();
        setBarangays(data);
      } catch (error) {
        console.error("Error fetching barangays:", error);
    }
    };

    fetchBarangays();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      specifyNecessities: { ...prevData.specifyNecessities, [name]: value },
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      necessities: checked
        ? [...prevData.necessities, name]
        : prevData.necessities.filter((item) => item !== name),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        proofFile: e.target.files![0],
      }));
    }
  };

  const handleAgeGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseInt(value);
    
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      
      // Calculate total children
      const total = [
        newData.ageGroupInfant,
        newData.ageGroupEarlyChild,
        newData.ageGroupMiddleChild,
        newData.ageGroupAdolescent
      ].reduce((sum, val) => sum + (val === "" ? 0 : parseInt(val)), 0);
      
      return {
        ...newData,
        numberOfChildren: total
      };
    });
  };

  // Handle form input changes
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Compress the image
      let compressedFile = null;
      if (formData.proofFile) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        compressedFile = await imageCompression(formData.proofFile, options);
      }

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("completeName", formData.fullName);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("noOfFamilyMembers", formData.familyMembers);
      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("emailAddress", formData.email);
      formDataToSend.append("barangayId", formData.barangayId);
      formDataToSend.append("typeOfCalamity", formData.calamityType);
      formDataToSend.append("area", formData.area);
      formDataToSend.append(
        "inKindNecessities",
        formData.necessities.join(", ")
      );
      formDataToSend.append(
        "specifications",
        JSON.stringify(formData.specifyNecessities)
      );
      if (compressedFile) {
        formDataToSend.append("proofOfResidence", compressedFile);
      }
      formDataToSend.append("numberOfChildren", formData.numberOfChildren.toString());
      formDataToSend.append("ageGroupInfant", formData.ageGroupInfant);
      formDataToSend.append("ageGroupEarlyChild", formData.ageGroupEarlyChild);
      formDataToSend.append("ageGroupMiddleChild", formData.ageGroupMiddleChild);
      formDataToSend.append("ageGroupAdolescent", formData.ageGroupAdolescent);

      const response = await fetch("/api/recipient-request", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Submitting your request...</p>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <div className="text-5xl mb-4 text-primary">
              <FaCheckCircle className="mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-4">Request Submitted Successfully!</h3>
            <p className="mb-6">Your donation request has been submitted successfully.</p>
            <a 
              onClick={handleRedirect}
              role="button"
              className="btn btn-primary text-white"
            >
              Return to Home
            </a>
          </div>
        </div>
      )}

      <div>
        <div className="sticky top-16 z-40">
          <PhilippinesClock />
          <div className="hero-background bg-cover max-h-[30rem]">
            <div className="py-10 text-center backdrop-blur-sm">
              <h1 className="text-5xl font-bold text-white">
                Donation Request Posting
              </h1>
            </div>
          </div>
        </div>
        <div className="flex justify-center m-10">
          <div className="card outline outline-primary bg-base-100 w-full shadow-xl">
            <div className="card-title rounded-t-xl p-5 bg-primary align-middle">
              <h2 className="text-white text-2xl">Head of the Family:</h2>
              <p className="text-white text-lg">Fill the details</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="fullName"
                  >
                    <span className="flex items-center gap-2">
                      <FaUser className="text-primary" />
                      Full Name
                    </span>
                  </label>
                  <input
                    className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
                {/* Age and Contact Number - Make responsive */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                  <div className="w-full md:w-1/2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                      <span className="flex items-center gap-2">
                        <FaPhone className="text-primary" />
                        Age
                      </span>
                    </label>
                    <input
                      className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="age"
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Age"
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                      <span className="flex items-center gap-2">
                        <FaPhone className="text-primary" />
                        Contact Number
                      </span>
                    </label>
                    <input
                      className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="contactNumber"
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="Contact Number"
                      required
                      pattern="[0-9]{11}"
                      title="Please enter a valid 11-digit contact number"
                    />
                  </div>
                </div>
                {/* Email and Family Members - Make responsive */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                  <div className="w-full md:w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      <span className="flex items-center gap-2">
                        <FaEnvelope className="text-primary" />
                        Email Address (Optional)
                      </span>
                    </label>
                    <input
                      className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="familyMembers"
                    >
                      <span className="flex items-center gap-2">
                        <FaUsers className="text-primary" />
                        No. of Family Members
                      </span>
                    </label>
                    <input
                      className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="familyMembers"
                      type="number"
                      name="familyMembers"
                      value={formData.familyMembers}
                      onChange={handleChange}
                      placeholder="Number of Family Members"
                      required
                    />
                  </div>
                </div>
                {/* Age Groups - Update grid */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    <span className="flex items-center gap-2">
                      <MdChildCare className="text-primary" />
                      Number of Children by Age Group
                    </span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Infant (0-2 years)
                      </label>
                      <input
                        className="input input-bordered input-primary w-full"
                        type="number"
                        name="ageGroupInfant"
                        value={formData.ageGroupInfant}
                        onChange={handleAgeGroupChange}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Early Childhood (3-5 years)
                      </label>
                      <input
                        className="input input-bordered input-primary w-full"
                        type="number"
                        name="ageGroupEarlyChild"
                        value={formData.ageGroupEarlyChild}
                        onChange={handleAgeGroupChange}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Middle Childhood (6-11 years)
                      </label>
                      <input
                        className="input input-bordered input-primary w-full"
                        type="number"
                        name="ageGroupMiddleChild"
                        value={formData.ageGroupMiddleChild}
                        onChange={handleAgeGroupChange}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Adolescence (12-17 years)
                      </label>
                      <input
                        className="input input-bordered input-primary w-full"
                        type="number"
                        name="ageGroupAdolescent"
                        value={formData.ageGroupAdolescent}
                        onChange={handleAgeGroupChange}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-gray-700 text-sm font-bold">
                      Total Number of Children: {formData.numberOfChildren}
                    </label>
                  </div>
                </div>
                {/* Barangay and Area - Make responsive */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                  <div className="w-full md:w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="barangay"
                    >
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        Barangay
                      </span>
                    </label>
                    <select
                      className="select select-primary w-full max-w-full"
                      id="barangayId"
                      name="barangayId"
                      value={formData.barangayId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Barangay</option>
                      {barangays.map(
                        (
                          barangay // Map over the barangays state
                        ) => (
                          <option key={barangay.id} value={barangay.id}>
                            {barangay.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="w-full md:w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="area"
                    >
                      Area
                    </label>
                    <input
                      className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="area"
                      type="text"
                      name="area"
                      value={formData.area} // Add area to formData
                      onChange={handleChange}
                      placeholder="Area"
                      required
                    />
                  </div>
                </div>
                {/* Type of Calamity */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="calamityType"
                  >
                    <span className="flex items-center gap-2">
                      <FaExclamationTriangle className="text-primary" />
                      Type of Calamity
                    </span>
                  </label>
                  <select
                    className="select select-primary w-full max-w-full"
                    id="calamityType"
                    name="calamityType"
                    value={formData.calamityType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Calamity</option>
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Tropical Disease">Tropical Disease</option>
                    <option value="Drought">Drought</option>
                    <option value="Dengue Fever">Dengue Fever</option>
                    <option value="Water Shortage">Water Shortage</option>
                    <option value="Heatwave">Heatwave</option>
                    <option value="Tsunami">Tsunami</option>
                    <option value="Leptospirosis">Leptospirosis</option>
                    <option value="Volcanic Eruption">Volcanic Eruption</option>
                    <option value="Landslide">Landslide</option>
                    <option value="Typhoon">Typhoon</option>
                    <option value="Fire">Fire</option>
                  </select>
                </div>
                {/* In-Kind Necessities - Update grid */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    In-Kind Necessities
                    <span className="text-gray-500 block text-xs md:inline md:text-sm">
                      (Cash is not included in the donation request)
                    </span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Child and Infant Care Items",
                      "Clothing and Footwear",
                      "Cleaning and Sanitary Supplies",
                      "Education",
                      "Electronic Devices",
                      "Construction Materials",
                      "Emergency Communications and Connectivity",
                      "First Aid Kit Essentials",
                      "Fire Prevention and Safety Products",
                      "Health",
                      "Hygiene Supplies",
                      "Livelihood Support",
                      "Livestock and Animal care",
                      "Planting materials",
                      "Food",
                      "Shelter Materials",
                      "Solar Energy Solutions",
                      "Water Filtration and Purification Systems",
                    ].map((necessity) => (
                      <div key={necessity} className="relative flex items-center">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name={necessity}
                            className="checkbox checkbox-primary"
                            checked={formData.necessities.includes(necessity)}
                            onChange={handleCheckboxChange}
                          />
                          <span className="ml-2">{necessity}</span>
                        </label>
                        {formData.necessities.includes(necessity) && (
                          <input
                            className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id={`specify-${necessity}`}
                            type="text"
                            name={necessity}
                            value={formData.specifyNecessities[necessity as keyof typeof formData.specifyNecessities] || ""}
                            onChange={handleSpecifyChange}
                            placeholder="Please specify"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="proofFile"
                  >
                    <span className="flex items-center gap-2">
                      <FaFileUpload className="text-primary" />
                      Proof of Situation (example: Image of calamity impact in your
                      area)
                    </span>
                  </label>
                  <input
                    className="file-input file-input-bordered file-input-primary w-full"
                    id="proofFile"
                    type="file"
                    name="proofFile"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="btn btn-primary btn-md text-white"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
