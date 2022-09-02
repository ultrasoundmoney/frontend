import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import headerGlowSvg from "./header-glow.svg";

const HeaderGlow: FC = () => (
  <div
    className={`
      absolute w-full top-0
      h-[500px]
      xs:h-[650px]
      md:h-[700px]
      lg:h-[800px]
      xl:h-[900px]
      2xl:h-[1200px]
      overflow-hidden flex justify-center
      -z-10
    `}
  >
    <div
      className={`
        absolute
        w-full
        h-full
        -top-[120px]
        xs:-top-[180px]
        sm:-top-[200px]
        md:-top-[240px]
        lg:-top-[280px]
        xl:-top-[320px]
        2xl:-top-[440px]
        select-none
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
