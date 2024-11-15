"use client";
import React from "react";

export default function LearnMore() {
  return (
    <main className="px-5">
      {/* Hero Section with Full-Page Background Image */}
      <section
        className="hero-background bg-cover h-screen mb-20"
        style={{
          backgroundImage:
            "url(https://cashmart.ph/wp-content/uploads/2023/03/Kyah-Pembarya-Should-You-Give-Money-to-Street-Children.jpg)",
        }}
      >
        <div className="bg-black bg-opacity-60 h-full flex flex-col justify-center items-center text-center px-5">
          <h1 className="text-white text-6xl font-bold mb-5">
            Every Act of Kindness Counts
          </h1>
          <p className="text-white text-2xl max-w-2xl">
            Your generosity directly impacts the lives of those affected by
            calamities. Together, we can rebuild lives, one donation at a time.
          </p>
        </div>
      </section>
      {/* Intro Section */}
      <section className="bg-green-100 py-16 mb-16 rounded-lg">
        <div className="max-w-4xl mx-auto text-center px-5">
          <h2 className="text-5xl font-bold mb-5 text-green-800">
          Empowering Giving, Every Day, and in Every Way.
          </h2>
          <p className="text-xl text-green-700">
            At HirayaLink, we believe that every contribution counts. By
            connecting donors directly with those in need, we ensure that your
            generosity has a meaningful impact. 
          </p><br />
          <p className="text-xl text-green-700">
          For Filipino families, especially in disaster-prone areas, in-kind donations are lifelines. From food and clothing to medical and educational materials and construction items, all represent fundamental resources affecting people&apos;s lives. Food feeds children; clothing brings warmth and dignity; school materials open up hope for a brighter future; hygiene and health goods ward off infections; and reconstruction of homes and life is done through construction material supplies. In-kind contributions are meant to address urgent needs but often remind the recipient that one is not alone, thus creating a sense of community and solidarity. Contributions of this nature and others can inspire hope and produce lasting positive change.
          </p>
        </div>
      </section>

       

      {/* Challenges Section */}
      <section className="bg-white py-16 mb-16 rounded-lg shadow-lg">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-4xl font-bold mb-5 text-green-800">
            The Challenges We Face
          </h2>
          <p className="text-lg mb-3 text-gray-700">
            Existing donation systems often lack transparency and communication
            efficiency, leading to delayed aid and reduced trust among
            stakeholders. Potential donors find it difficult to interact with
            recipients or assess the impact of their donations, reducing their
            motivation to contribute.
          </p>
          <p className="text-lg text-gray-700">
            Additionally, acquiring timely information about those affected by
            disasters is complicated, which further hinders the donation
            process.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-green-100 py-16 mb-16 rounded-lg">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-4xl font-bold mb-5 text-green-800">
            Our Solution: HirayaLink
          </h2>
          <p className="text-lg mb-3 text-green-700">
            HirayaLink offers a centralized platform to improve transparency and
            coordination in the donation process. We empower LGUs and NGOs to
            verify the needs of recipients and create official donation requests
            on behalf of their constituents.
          </p>
          <p className="text-lg text-green-700">
            Our system helps prevent misuse, ensuring that only verified needs
            are posted, and that donors can track their contributions from start
            to finish.
          </p>
        </div>
      </section>

      {/* System Details Section */}
      <section className="bg-white py-16 mb-16 rounded-lg shadow-lg">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-4xl font-bold mb-5 text-green-800">
            How Our System Works
          </h2>

          {/* Recipients Info */}
          <div className="bg-green-50 p-6 rounded-lg shadow-md mb-10">
            <h3 className="text-3xl font-bold mb-3 text-green-800">
              For Recipients:
            </h3>
            <p className="text-lg mb-2 text-green-700">
              Recipients do not need to register. They can post donation
              requests directly, which will be visible to the public and
              barangay admins. Each request should include:
            </p>
            <ul className="list-disc pl-10 mb-3 text-lg text-green-700">
              <li>Complete name of the head of the family</li>
              <li>Age of the head of the family</li>
              <li>Number of family members</li>
              <li>Contact number</li>
              <li>Barangay number</li>
              <li>Email address (optional)</li>
              <li>Type of calamity or reason for the request</li>
              <li>Photo evidence of the situation</li>
            </ul>
            <p className="text-lg text-green-700">
              Barangay admins will verify the needs and post an official request
              for donors to pledge.
            </p>
          </div>

          {/* Donors Info */}
          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold mb-3 text-green-800">
              For Donors:
            </h3>
            <p className="text-lg mb-2 text-green-700">
              Donors will need to register on the platform to access official
              donation requests posted by barangay admins. After registration,
              donors can:
            </p>
            <ul className="list-disc pl-10 mb-3 text-lg text-green-700">
              <li>View verified donation requests from various barangays</li>
              <li>
                Track the status of their donation from pledge to delivery
              </li>
              <li>See success stories of previous donations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-200 py-16 text-center mb-10 rounded-lg">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-4xl font-bold mb-5 text-green-900">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl text-green-800">
            Together, we can provide essential support to vulnerable communities
            and ensure that help reaches those who need it most.
          </p>
          <a
            role="button"
            className="btn btn-primary text-white mt-5"
            href="/signup"
          >
            Donate Now
          </a>
        </div>
      </section>
    </main>
  );
}
