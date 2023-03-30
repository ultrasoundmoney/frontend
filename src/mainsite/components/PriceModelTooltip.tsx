import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import roundNerdLarge from "../../assets/round-nerd-large.svg";
import BodyTextV3 from "../../components/TextsNext/BodyTextV3";
import { WidgetTitle } from "../../components/WidgetSubcomponents";

const PriceModelTooltip: FC<{
  onClickClose: () => void;
}> = ({ onClickClose }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
    }}
    className={`
      relative
      flex w-[22rem] flex-col
      gap-y-4 rounded-lg border
      border-slateus-400 bg-slateus-700
      p-8
    `}
  >
    <img
      alt="a close button, circular with an x in the middle"
      className="absolute top-5 right-5 w-6 cursor-pointer select-none hover:brightness-90 active:brightness-110"
      onClick={onClickClose}
      src="/close.svg"
    />
    <Image
      alt=""
      className="mx-auto w-20 h-20 rounded-full select-none"
      src={roundNerdLarge as StaticImageData}
    />
    <BodyTextV3 className="font-semibold">price model</BodyTextV3>
    <WidgetTitle>formula</WidgetTitle>
    <BodyTextV3 className="whitespace-pre-wrap md:leading-normal">
      profits = revenue (burn) - expenses (issuance)
    </BodyTextV3>
    <BodyTextV3 className="whitespace-pre-wrap md:leading-normal">
      price = profits * P/E ratio * monetary premium
    </BodyTextV3>
  </div>
);

export default PriceModelTooltip;
