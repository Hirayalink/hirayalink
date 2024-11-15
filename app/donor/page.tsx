"use client";
//install npm install react-swipeable//
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { FaHeart } from "react-icons/fa";

export default function Donor() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/Philippines.png",
    "/image2.jpg",
    "/image3.jpg",
    "/image4.jpg",
    "/image5.png",
  ];

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    trackMouse: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 py-5">
      {/* Welcome Message Section */}
      <div className="w-full max-w-7xl bg-base-100 shadow-lg rounded-lg overflow-hidden text-center py-4 mb-6">
        <h1 className="text-3xl font-bold">
          WELCOME TO <span className="text-primary">HIRAYA</span>
          <span>LINK</span>, DONOR{" "}
          <span className="inline-block text-primary p-1/2">
            <FaHeart className="text-2xl" />
          </span>
          !
        </h1>
      </div>

      {/* Post Container */}
      <div className="w-full max-w-7xl bg-base-100 shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[800px]">
        {/* Slider Section */}
        <div
          className="lg:w-2/3 w-full flex flex-col p-6 bg-base-100 relative"
          {...handlers}
        >
          <div className="relative mb-4 h-[350px] sm:h-[450px] lg:h-[450px]">
            <Image
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              fill
              className="object-cover rounded-lg transition-opacity duration-300"
            />
          </div>

          {/* Description Section */}
          <div className="flex flex-col justify-start text-gray-800 mt-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              <span className="text-primary">HIRAYA</span>
              <span>LINK</span>: Empowering Giving, Every Day and in Every Way
            </h2>
            <p className="text-sm sm:text-base">
              At HirayaLink, we connect those in need with generous donors who
              are ready to make a real impact. By exploring the requests from
              various communities, you can provide assistance where it&apos;s needed
              most. Whether you&apos;re looking to donate in-kind items, every
              contribution has the power to change lives. You can easily view
              barangay donation requests or recipient requests using the buttons
              on the right. Rest assured, your donations are genuinely
              needed—barangay officials oversee verified donation drives and
              confirm that the content of each recipient request post reflects
              actual needs within their communities. Join us in building
              stronger communities and making a lasting difference in people&apos;s
              lives. Your kindness and generosity can spark hope and
              transformation for those facing challenges.
            </p>
          </div>
        </div>

        {/* Right Side: Button Section */}
        <div className="lg:w-1/3 w-full p-6 lg:p-8 bg-secondary flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Choose Your Action
          </h2>
          <br />
          <p className="text-base sm:text-lg mb-6">
            Stay informed with updated information on individuals and barangays
            affected by the calamity, as well as other essential resources.
            Select an option to view the timelines.
          </p>
          <br />
          <div className="space-y-4">
            <p>
              You can see official donation drives for each barangay here, where
              you can pledge your donations. We’ll track your contributions
              until they reach the affected areas and the intended recipients.
            </p>
            <div
              role="button"
              onClick={() => router.push("/donor/barangay-requests")}
              className="btn btn-primary btn-lg w-full text-lg text-white"
            >
              Barangay Donation Request Timeline
            </div>
            <p>
              You can view posts from individuals affected by the calamity,
              allowing you to see their situations, requests, and current
              conditions.
            </p>
            <div
              role="button"
              onClick={() => router.push("/donor/recipient-requests")}
              className="btn btn-primary w-full text-lg text-white"
            >
              Recipient Request Timeline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
