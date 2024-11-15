import Image from 'next/image'

export default function About() {
  return (
    <div>
      <div className="hero-background bg-cover max-h-[30rem]">
        <div className="py-10 text-center backdrop-blur-sm bg-black/25">
          <h1 className="text-5xl font-bold text-white">HirayaLink</h1>
        </div>
      </div>

      <div className="py-12 md:py-16">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <Image 
            src="/helping-hand.jpg" 
            alt="About Us"
            width={2000}
            height={250}
            className="w-full h-auto rounded-lg shadow-lg" 
            priority 
          />

          <div className="absolute bottom-0 left-0 right-0 bg-primary p-4 md:p-6 rounded-md max-w-lg mx-auto transform translate-y-1/2 shadow-xl">
            <p className="text-center text-white text-xl md:text-2xl font-semibold">
              About Us
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 mt-16 md:mt-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            At HirayaLink, we are deeply committed to enhancing the lives of
            individuals and communities in need. Our platform serves as a vital
            connection between generous donors and those who require support,
            ensuring that aid is directed precisely where it is needed most. Our
            mission is to streamline the process of giving and receiving aid,
            making it both efficient and impactful. <br />
            <br />
            We are dedicated to fostering a culture of compassion and
            collaboration through innovative solutions that address the
            challenges faced by underserved communities. Our team of dedicated
            professionals works tirelessly to ensure that every contribution has
            a meaningful and lasting impact. By leveraging technology and
            fostering a network of committed partners, we strive to create a
            more equitable world where everyone has the opportunity to thrive.{" "}
            <br />
            <br />
            At HirayaLink, we believe that through collective effort and a
            shared vision, we can build a brighter future for all. Our
            commitment to transparency, efficiency, and compassion guides
            everything we do, and we are honored to play a role in transforming
            lives and communities for the better. <br />
            <br />
          </p>
        </div>
      </div>

      <div className="divider divider-primary mx-4 md:mx-10 my-12"></div>

      <div className="py-8 px-4 sm:px-8 lg:px-12">
        <div className="relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Goals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-primary p-5 rounded-lg shadow-md mx-auto w-full">
                <p className="text-white text-lg md:text-xl font-bold">
                  Enhance Disaster Relief Coordination
                </p>
              </div>
              <p className="mt-4 mx-auto text-gray-800 text-base md:text-lg leading-relaxed">
                We aim to improve the coordination, transparency, and efficiency
                of disaster relief efforts. Our goal is to expedite the donation
                process, benefiting donors, logistics providers, and recipients
                alike.
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-primary p-5 rounded-lg shadow-md mx-auto w-full">
                <p className="text-white text-lg md:text-xl font-bold">
                  Promote Compassion and Bayanihan
                </p>
              </div>
              <p className="mt-4 mx-auto text-gray-700 text-base md:text-lg leading-relaxed">
                HirayaLink is dedicated to fostering a compassionate community
                by enabling direct engagement between donors and recipients. We
                highlight real success stories to inspire potential donors and
                reinforce their commitment to supporting marginalized and
                disadvantaged individuals.
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-primary p-5 rounded-lg shadow-md mx-auto w-full">
                <p className="text-white text-lg md:text-xl font-bold">
                  Provide Timely and Reliable Information
                </p>
              </div>
              <p className="mt-4 mx-auto text-gray-700 text-base md:text-lg leading-relaxed">
                Our platform is designed to offer potential donors timely and
                reliable information about individuals affected by natural
                disasters. We aim to enable quick and effective responses to
                urgent needs.
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-primary p-5 rounded-lg shadow-md mx-auto w-full">
                <p className="text-white text-lg md:text-xl font-bold">
                  Simplify Donation Processes
                </p>
              </div>
              <p className="mt-4 mx-auto text-gray-700 text-base md:text-lg leading-relaxed">
                We seek to offer an alternative to traditional donation systems
                through a centralized platform that streamlines donation
                processes. With a user-centered approach, HirayaLink focuses on
                accessibility and ease of navigation for all users.
              </p>
            </div>

            <div className="text-center col-span-1 md:col-span-2 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-primary p-5 rounded-lg shadow-md mx-auto w-full max-w-[900px]">
                <p className="text-white text-lg md:text-xl font-bold">
                  Facilitate Efficient Communication
                </p>
              </div>
              <p className="mt-4 mx-auto text-gray-800 text-base md:text-lg leading-relaxed max-w-[880px]">
                Our goal is to establish direct communication channels between
                donor organizations, contributors, logistics partners, recipient
                organizations, and individuals in remote areas. This will ensure
                efficient information exchange and minimize risks associated
                with the collection, transportation, and distribution of in-kind
                donations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
