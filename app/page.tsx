import Image from "next/image";

export default function Landing() {
  return (
    <main>
      <div className="hero hero-background min-h-screen">
        <div className="hero-overlay backdrop-blur-sm bg-black/25"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <Image src={"/aidlink.svg"} alt="hirayalink" width={500} height={500}></Image>
            <h1 className="mb-5 text-5xl font-bold">
              <span className="text-primary">HIRAYA</span>
              <span className="text-white">LINK</span>
            </h1>
            <a role="button" href="/home" className="btn btn-primary">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
