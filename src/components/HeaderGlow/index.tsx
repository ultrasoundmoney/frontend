import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC } from "react";
import headerGlowSvg from "./header-glow.svg";

const HeaderGlow: FC<{ className?: string }> = ({ className }) => (
  <div
    className={`
      absolute top-0 left-0 -z-10
      flex
      h-[500px]
      w-full
      justify-center
      overflow-hidden
      xs:h-[650px]
      md:h-[700px] lg:h-[800px] xl:h-[900px]
      2xl:h-[1200px]
      ${className}
    `}
  >
    <div
      className={`
        absolute
        -top-[120px]
        h-full
        w-full
        select-none
        xs:-top-[180px]
        sm:-top-[200px]
        md:-top-[240px]
        lg:-top-[280px]
        xl:-top-[320px]
        2xl:-top-[440px]
      `}
    >
      <Image
        className="object-cover sm:object-scale-down"
        alt=""
        src={headerGlowSvg as StaticImageData}
        layout="fill"
        priority
        quality={100}
      />
    </div>
  </div>
);

export default HeaderGlow;
