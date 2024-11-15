"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression"; // You'll need to install this package
import PhilippinesClock from "./PhilippinesClock";

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
  });
  const [barangays, setBarangays] = useState<Barangay[]>([]); // Update the state definition

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

  // Handle form input changes
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      const response = await fetch("/api/recipient-request", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Your request has been submitted successfully.");
        router.push("/");
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "An error occurred while submitting your request. Please try again."
      );
    }
  };

  return (
    <div>
      <PhilippinesClock />
      <div className="hero-background bg-cover max-h-[30rem]">
        <div className="py-10 text-center backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-white">
            Donation Request Posting
          </h1>
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
                  Full Name
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
              {/* Age and Contact Number */}
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="age"
                  >
                    Age
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
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="contactNumber"
                  >
                    Contact Number
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
                  />
                </div>
              </div>
              {/* Email and Number of Family Members */}
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email Address (Optional)
                  </label>
                  <input
                    className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="familyMembers"
                  >
                    No. of Family Members
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
              {/* Barangay Number Area */}
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="barangay"
                  >
                    Barangay
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
                <div className="w-1/2">
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
                  Type of Calamity
                </label>
                <select
                  className="input input-bordered input-primary w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="calamityType"
                  name="calamityType"
                  value={formData.calamityType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled selected>Select Calamity</option>
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
              {/* In-Kind Necessities */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  In-Kind Necessities{" "}
                  <span className="text-gray-500">
                    (Cash is not included in the donation request)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-4">
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
                  Proof of Situation (example: Image of calamity impact in your
                  area)
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
  );
}
