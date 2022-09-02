import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import headerGlowSvg from "../../assets/blurred-bg.svg";

const HeaderGlow: FC = () => (
  <div
    className={`
      absolute
      w-full
      h-[600px] -mt-[50px]
      lg:h-[700px]
      xl:h-[800px]
      2xl:h-[1600px] 2xl:-mt-[310px]
      -z-10
      select-none
    `}
  >
    <Image
      className=""
      alt=""
      src={headerGlowSvg as StaticImageData}
      layout="fill"
      priority
      quality={100}
      objectFit="cover"
    />
  </div>
);

export default HeaderGlow;
