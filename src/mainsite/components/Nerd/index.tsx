import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC } from "react";
import nerdColorOff from "./nerd-coloroff.svg";
import nerdColorOn from "./nerd-coloron.svg";

const Nerd: FC = () => (
  <div className="relative">
    <div
      className={`
        gray-nerd
        relative
        z-10
        ml-2 flex cursor-pointer select-none
        hover:opacity-0 [&+.color-nerd]:active:brightness-75
      `}
    >
      <Image
        alt="a nerd emoji offering deeper explanation of a nearby metric"
        height={21}
        priority
        src={nerdColorOff as StaticImageData}
        width={21}
      />
    </div>
    <div className="color-nerd absolute top-0 ml-2 select-none">
      <Image
        alt="a colored nerd emoji offering deeper explanation of a nearby metric"
        height={21}
        src={nerdColorOn as StaticImageData}
        width={21}
      />
    </div>
  </div>
);

export default Nerd;
