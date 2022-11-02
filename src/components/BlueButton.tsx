import type { FC } from "react";
import BodyTextV2 from "./TextsNext/BodyTextV2";

const BlueButton: FC = () => (
  <button
    className={`
      group
      relative flex h-fit
      select-none
      rounded-full bg-gradient-to-tr
      from-cyan-400 to-indigo-600
      px-4
      py-2
      font-light
      text-white
      md:m-0.5
      md:py-1.5
    `}
  >
    <BodyTextV2 className="z-10">copy</BodyTextV2>
    <div
      className={`
        absolute left-[1px] right-[1px] top-[1px] bottom-[1px]
        rounded-full bg-slateus-700
        group-hover:hidden
      `}
    ></div>
  </button>
);

export default BlueButton;
