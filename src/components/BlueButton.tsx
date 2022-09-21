import type { FC } from "react";
import BodyTextV2 from "./TextsNext/BodyTextV2";

const BlueButton: FC = () => (
  <button
    className={`
      relative
      bg-gradient-to-tr from-cyan-400 to-indigo-600
      rounded-full
      px-4 py-2
      md:py-1.5 md:m-0.5
      text-white
      font-light
      flex
      group
      select-none
      h-fit
    `}
  >
    <BodyTextV2 className="z-10">copy</BodyTextV2>
    <div
      className={`
        absolute left-[1px] right-[1px] top-[1px] bottom-[1px]
        bg-slateus-700 rounded-full
        group-hover:hidden
      `}
    ></div>
  </button>
);

export default BlueButton;
