"use client";
import "@/styles/embla.css";
import { EmblaCarousel } from "@/components/EmblaCarousel";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SlideData {
  calamityImpacts: Array<{
    id: string;
    area: string;
    nameOfCalamity: string;
    storyText: string | null;
    image: Buffer | null;
    Barangay: { name: string } | null;
    createdAt: Date;
  }>;
  successStories: Array<{
    id: string;
    area: string | null;
    nameOfCalamity: string | null;
    storyText: string | null;
    image: Buffer | null;
    Barangay: { name: string } | null;
    batchNumber: string;
    createdAt: Date;
  }>;
}

export default function Home() {
  const [slideData, setSlideData] = useState<SlideData>({
    calamityImpacts: [],
    successStories: []
  });

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("/api/slides");
        if (!response.ok) {
          throw new Error('Failed to fetch slides');
        }
        const data = await response.json();
        setSlideData({
          calamityImpacts: data.calamityImpacts || [],
          successStories: data.successStories || []
        });
      } catch (error) {
        console.error("Failed to fetch slides:", error);
        setSlideData({
          calamityImpacts: [],
          successStories: []
        });
      }
    };

    fetchSlides();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <div className="hero-background bg-cover max-h-[30rem] mb-20">
        <div className="text-center pt-10 pb-20 backdrop-blur-sm">
          <h1 className="mb-5 py-10 text-5xl font-bold text-white">
            Your Help Matters
          </h1>
          <p className="text-xl text-white py-5">
            Together we help those in need
          </p>
        </div>
      </div>

      {/* Mission and Vision Section */}
      <div className="flex flex-col mx-5 items-center">
        <div className="flex flex-col sm:flex-row gap-20 justify-center">
          <div className="card bg-primary max-w-96 shadow-xl text-white bottom-36">
            <div className="card-body">
              <h2 className="card-title">Mission</h2>
              <p>
                To connect donors with those in need through a centralized
                platform that enhances disaster relief efforts with
                transparency, efficiency, and compassion.
              </p>
            </div>
            <figure>
              <Image
                src="/mission-vission/mission.jpg"
                alt="Mission"
                width={500} // adjust based on your image size
                height={300} // adjust based on your image size
                className="w-full h-auto" // maintain responsive behavior
                priority // if this is above the fold
              />
            </figure>
          </div>
          <div className="card bg-primary max-w-96 shadow-xl text-white bottom-36">
            <div className="card-body">
              <h2 className="card-title">Vision</h2>
              <p>
                To be a leading platform for in-kind donations, ensuring swift,
                impactful support for vulnerable communities at all times.
              </p>
            </div>
            <figure>
              <Image
                src="/mission-vission/vision.png"
                alt="Vision"
                width={500} // adjust based on your image size
                height={300} // adjust based on your image size
                className="w-full h-auto" // maintain responsive behavior
                priority // if this is above the fold
              />
            </figure>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-10">
          <h1 className="mb-10 text-5xl font-bold">WELCOME!</h1>
          <p className="text-xl">
            Empowering Giving, Every Day, and in Every Way.
          </p>
          <a
            role="button"
            className="btn btn-outline btn-wide mt-10"
            href="/learn-more"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Slideshow Section */}
      <div className="flex flex-col md:flex-row gap-10 px-10 py-16">
        {/* Calamity Impact Slideshow */}
        <div className="w-full rounded-xl overflow-hidden shadow-lg">
          <h2 className="text-2xl font-bold p-4 bg-base-200">
            Calamity Impact
          </h2>
          {slideData.calamityImpacts.length > 0 ? (
            <EmblaCarousel
              slides={slideData.calamityImpacts.map((impact) => ({
                ...impact,
                createdAt: impact.createdAt.toString(),
              }))}
              type="calamity"
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
        </div>

        {/* Stories of Change Slideshow */}
        <div className="w-full rounded-xl overflow-hidden shadow-lg">
          <h2 className="text-2xl font-bold p-4 bg-base-200">
            Stories of Change
          </h2>
          {slideData.successStories.length > 0 ? (
            <EmblaCarousel
              slides={slideData.successStories.map((story) => ({
                ...story,
                area: story.area || null,
                nameOfCalamity: story.nameOfCalamity || null,
                storyText: story.storyText || null,
                image: story.image || null,
                Barangay: story.Barangay || null,
                createdAt: story.createdAt.toString(),
              }))}
              type="success"
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
