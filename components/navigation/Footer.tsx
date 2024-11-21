import Image from "next/image";

export default function Footer() {
  return (
    <footer className="divider divider-primary p-10">
      <div className="grid grid-flow-row auto-rows-max justify-items-center">
        <Image
          src="/aidlink.svg"
          alt="HirayaLink"
          width={48}
          height={48}
          className="max-w-12"
        />
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 sm:mb-0">
            <span className="text-primary font-bold">HIRAYA</span>
            <span className="font-bold">LINK</span>
          </div>
          <span className="text-sm sm:text-base">
            Copyright © {new Date().getFullYear()} - All right reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
