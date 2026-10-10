import Image from "next/image";
export default function Photo() {
  return (
    <div className="relative w-[298px] h-[298px] lg:w-[430px] lg:h-[430px]">
      <Image src="/assets/my-picture.webp"
        alt="Illustrated portrait of Majed Ziara, Laravel and Next.js developer"
        fill preload fetchPriority="high" sizes="(min-width: 1024px) 430px, 298px"
        className="object-contain rounded-full p-2" />
      <svg aria-hidden="true" className="portrait-ring absolute inset-0 w-full h-full" fill="none" viewBox="0 0 506 506">
        <circle cx="253" cy="253" r="250" stroke="#00ff99" strokeWidth="4" strokeLinecap="round" strokeDasharray="24 10 0 0" />
      </svg>
    </div>
  );
}
