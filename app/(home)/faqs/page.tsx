'use client';

export default function FAQs() {
  return (
    <div>
      <div className="bg-primary py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-white mb-8 md:mb-0 text-center md:text-left">
              <h1 className="text-5xl font-bold mb-4">FAQ</h1>
              <p className="text-lg text-justify">
                Welcome to the HirayaLink FAQ page! Here, we&apos;ve compiled answers to some of the most common questions to help you navigate our platform and understand how we facilitate in-kind donations for those in need. Whether you&apos;re a donor or a recipient, this section will guide you through our processes, from making donations to tracking contributions. If you don&apos;t find the answers you&apos;re looking for, feel free to reach out to us for further assistance.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="join join-vertical w-full">
                <div className="collapse collapse-plus join-item">
                  <input type="checkbox" /> 
                  <div className="collapse-title text-lg font-semibold">
                    What is HirayaLink?
                  </div>
                  <div className="collapse-content">
                    <p className="pl-4">HirayaLink is a centralized web-based platform designed to facilitate in-kind donations to individuals and victims of natural disasters and calamities in the Philippines. It aims to enhance the efficiency, transparency, and coordination of disaster relief efforts.</p>
                  </div>
                </div>

                <div className="collapse collapse-plus join-item">
                  <input type="checkbox" />
                  <div className="collapse-title text-lg font-semibold">
                    Who can use HirayaLink?
                  </div>
                  <div className="collapse-content">
                    <p className="pl-4">HirayaLink is designed for donors, recipients (individuals in need), local government units (LGUs), and non-governmental organizations (NGOs) involved in disaster relief efforts.</p>
                  </div>
                </div>

                <div className="collapse collapse-plus join-item">
                  <input type="checkbox" />
                  <div className="collapse-title text-lg font-semibold">
                    What types of donations can be made through HirayaLink?
                  </div>
                  <div className="collapse-content">
                    <p className="pl-4">Users can make in-kind donations, which include non-monetary contributions such as food, clothing, educational materials, medical supplies, and shelter materials. Cash donations are not included in this platform.</p>
                  </div>
                </div>

                <div className="collapse collapse-plus join-item">
                  <input type="checkbox" />
                  <div className="collapse-title text-lg font-semibold">
                    How does HirayaLink ensure transparency in donations?
                  </div>
                  <div className="collapse-content">
                    <p className="pl-4">The platform includes tracking features that allow donors to see where their contributions go, ensuring accountability and transparency in the donation process.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">For Donors</h2>
          </div>

          <div className="join join-vertical w-full">
            <div className="collapse collapse-plus join-item">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">
                How can I donate through HirayaLink?
              </div>
              <div className="collapse-content">
                <p className="pl-4">Donors can browse official donation requests posted by barangay admins on the platform. After selecting a request, they can pledge their donations through the system.</p>
              </div>
            </div>

            <div className="collapse collapse-plus join-item">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">
                Can I track my donation?
              </div>
              <div className="collapse-content">
                <p className="pl-4">Yes, HirayaLink provides real-time tracking of donations. Barangay admins will input the tracking information, allowing donors to monitor the status of their contributions until they reach the intended recipients.</p>
              </div>
            </div>

            <div className="collapse collapse-plus join-item">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">
                What information will I receive after making a donation?
              </div>
              <div className="collapse-content">
                <p className="pl-4">Donors will receive notifications regarding the status of their donation, including updates on whether it has been received, is in transit, or has been delivered.</p>
              </div>
            </div>

            <div className="collapse collapse-plus join-item">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">
                How does the barangay admin handle donation requests?
              </div>
              <div className="collapse-content">
                <p className="pl-4">The barangay admin confirms the actual need for a donation drive based on requests from constituents. They post official donation requests on the platform and are responsible for receiving and tracking donations until they are distributed to the recipients.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">For Recipients</h2>
          </div>

          <div className="join join-vertical w-full">
            <div className="collapse collapse-plus join-item">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">
                How can I request a donation through HirayaLink?
              </div>
              <div className="collapse-content">
                <p className="pl-4">Recipients can submit their needs to their barangay admin. After assessing the situation, the barangay admin will confirm the need and post an official donation request on behalf of the constituents. Note: Recipients can also request assistance even without an account on the platform.</p>
              </div>
            </div>

            <div className="collapse collapse-plus join-item">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">
                What information do I need to provide when making a request?
              </div>
              <div className="collapse-content">
                <p className="pl-4">Recipients should provide details about their needs to the barangay admin, who will then compile the information to create an official donation request.</p>
              </div>
            </div>

            <div className="collapse collapse-plus join-item">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">
                How are donation requests verified?
              </div>
              <div className="collapse-content">
                <p className="pl-4">Donation requests are verified by barangay admins who assess the actual needs within their community. This process reduces the validation burden on the platform and helps prevent abuse.</p>
              </div>
            </div>

            <div className="collapse collapse-plus join-item">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">
                Can I receive assistance if I am not tech-savvy?
              </div>
              <div className="collapse-content">
                <p className="pl-4">HirayaLink aims to be user-friendly, and barangay admins are available to assist recipients in the process, helping them communicate their needs effectively.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
