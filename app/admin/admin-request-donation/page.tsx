"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import imageCompression from "browser-image-compression";
import { useSession } from "next-auth/react";

export default function AdminRequestDonation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const initialFormState = {
    barangayArea: "",
    calamityType: "",
    contactPerson: "",
    contactNumber: "",
    donationDropOff: "",
    donationLandmark: "",
    necessities: {} as Record<string, string[]>,
    specifications: {} as Record<string, string[]>,
    proofFile: null as File | null,
    area: "",
    batchNumber: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const areas = searchParams.get("areas")?.split(",") || [];
    const calamityTypes = searchParams.get("calamityTypes")?.split(",") || [];
    let necessities = {};
    let specifications = {};

    try {
      necessities = JSON.parse(searchParams.get("necessities") || "{}");
    } catch (error) {
      console.error("Error parsing necessities:", error);
    }

    try {
      specifications = JSON.parse(searchParams.get("specifications") || "{}");
    } catch (error) {
      console.error("Error parsing specifications:", error);
    }

    if (session) {
      const barangayName = session?.user?.brgyName || "";

      setFormData((prevData) => {
        const newData = {
          ...prevData,
          barangayArea: barangayName,
          area: areas.join(", "),
          calamityType: calamityTypes.join(", "),
          necessities: necessities,
          specifications: specifications,
        };
        return newData;
      });
    }
  }, [searchParams, session]);

  const handleClear = () => {
    setFormData(initialFormState);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        proofFile: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      const {
        barangayArea,
        area,
        calamityType,
        contactPerson,
        contactNumber,
        donationDropOff,
        donationLandmark,
        necessities,
        specifications,
        proofFile,
        batchNumber,
      } = formData;

      // Append form data
      formDataToSend.append("barangayArea", barangayArea);
      formDataToSend.append("area", area);
      formDataToSend.append("calamityType", calamityType);
      formDataToSend.append("contactPerson", contactPerson);
      formDataToSend.append("contactNumber", contactNumber);
      formDataToSend.append("donationDropOff", donationDropOff);
      formDataToSend.append("donationLandmark", donationLandmark);
      formDataToSend.append("necessities", JSON.stringify(necessities));
      formDataToSend.append("specifications", JSON.stringify(specifications));
      formDataToSend.append("batchNumber", batchNumber);

      // Handle file compression if a file is present
      if (proofFile) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(proofFile, options);
        formDataToSend.append("proofFile", compressedFile);
      }

      const response = await fetch("/api/barangay-request", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Your request has been submitted successfully.");
        router.push("/admin/dashboard");
      } else {
        console.error("Failed to submit form data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderNecessitiesAndSpecifications = () => {
    console.log("Rendering necessities:", formData.necessities);
    console.log("Rendering specifications:", formData.specifications);

    return (
      <div className="gap-4">
        {Object.entries(formData.necessities).map(
          ([category, items], index) => (
            <div key={index} className="m-2">
              <strong>{category}:</strong>{" "}
              {Array.isArray(items) ? items.join(", ") : String(items)}
              <span className="ml-2">
                {formData.specifications[category]
                  ? Array.isArray(formData.specifications[category])
                    ? formData.specifications[category].join(", ")
                    : String(formData.specifications[category])
                  : "No Specifications"}
              </span>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="hero-background bg-cover max-h-[30rem] sticky top-0 z-10">
        <div className="py-10 text-center backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-white">
            Donation Request Posting
          </h1>
        </div>
      </div>
      <div className="flex justify-center m-10">
        <div className="card outline outline-primary w-full bg-base-100 shadow-xl">
          <div className="card-title rounded-t-xl p-5 bg-primary flex justify-between items-center">
            <h2 className="text-white text-2xl">Fill in the details</h2>
            <button onClick={handleClear} className="btn btn-secondary btn-sm">
              Clear
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">
                    <span className="label-text">Barangay</span>
                  </label>
                  <input
                    className="input input-bordered input-secondary w-full"
                    id="barangayArea"
                    type="text"
                    name="barangayArea"
                    value={formData.barangayArea}
                    onChange={handleChange}
                    placeholder="e.g., Barangay, Tondo, Manila City"
                    required
                    readOnly
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Area</span>
                  </label>
                  <input
                    className="input input-bordered input-secondary w-full"
                    id="area"
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Area"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="label">
                    <span className="label-text">Calamity Type</span>
                  </label>
                  <select
                    className="select select-bordered select-secondary w-full"
                    id="calamityType"
                    name="calamityType"
                    value={formData.calamityType}
                    onChange={handleChange}
                    required
                    disabled
                  >
                    <option value="" disabled selected>
                      Select Calamity Type
                    </option>
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
                <div>
                  <label className="label">
                    <span className="label-text">
                      Donation Drop-Off Address
                    </span>
                  </label>
                  <input
                    className="input input-bordered input-secondary w-full"
                    id="donationDropOff"
                    type="text"
                    name="donationDropOff"
                    value={formData.donationDropOff}
                    onChange={handleChange}
                    placeholder="Drop-Off Address"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">
                      Donation Drop-Off Area Landmark
                    </span>
                  </label>
                  <input
                    className="input input-bordered input-secondary w-full"
                    id="donationLandmark"
                    type="text"
                    name="donationLandmark"
                    value={formData.donationLandmark}
                    onChange={handleChange}
                    placeholder="Nearby Landmark"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="label">
                    <span className="label-text">Person to Contact</span>
                  </label>
                  <input
                    className="input input-bordered input-secondary w-full"
                    id="contactPerson"
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Complete Name"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Contact Number</span>
                  </label>
                  <input
                    className="input input-bordered input-secondary w-full"
                    id="contactNumber"
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Batch Number</span>
                  </label>
                  <input
                    className="input input-bordered input-secondary w-full"
                    id="batchNumber"
                    type="number"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    placeholder="Batch Number"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="label">
                  <span className="label-text">In-Kind Necessities</span>
                </label>
                <div className="p-4 rounded-lg">
                  {renderNecessitiesAndSpecifications()}
                </div>
              </div>

              <div className="mb-4">
                <label className="label">
                  <span className="label-text">
                    Collage Photo of Calamity (if applicable)
                  </span>
                </label>
                <input
                  className="file-input file-input-bordered file-input-primary w-full"
                  id="proofFile"
                  type="file"
                  name="proofFile"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex justify-end">
                <button className="btn btn-primary text-white" type="submit">
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
