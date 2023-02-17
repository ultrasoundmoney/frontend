import { type FC, useState } from "react";

import { getRelayUrl, getRelayDisplayUrl } from "../config";
import Button from "../../components/BlueButton";
import { WidgetBackground } from "../../components/WidgetSubcomponents";
import LabelText from "../../components/TextsNext/LabelText";

const address = getRelayUrl();
const displayAddress = getRelayDisplayUrl();

const AddressWidget: FC = () => {
  const [copyTextVisible, setCopyTextVisible] = useState<boolean>(false);

  return (
    <WidgetBackground className="relative w-full overflow-hidden">
      <div
        className={`
            pointer-events-none absolute
            top-10 left-0 h-full
            w-full opacity-[0.3]
            blur-[70px]
            will-change-transform
            md:left-20
            md:opacity-[0.35]
          `}
      >
        <div
          className={`
              pointer-events-none
              absolute h-4/5 w-4/5 rounded-[35%] bg-[#243AFF]
              md:h-3/5
              md:w-3/5
            `}
        ></div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <LabelText>relay address</LabelText>
        <p
          className={`
            font-inter font-light text-green-400
            ${copyTextVisible ? "visible" : "invisible"}
        `}
        >
          copied!
        </p>
      </div>
      <div
        className={`
            mt-2 mb-2 flex flex-col items-center justify-between
            xs:flex-col sm:flex-row
            lg:flex-col xl:flex-row
         `}
      >
        <p
          className={`
            mb-3 break-all font-roboto font-light
            sm:mb-0 sm:grow sm:text-center lg:mb-3 xl:mb-0
          `}
        >
          <span
            className="bg-gradient-to-r from-orange-400
            to-yellow-300 bg-clip-text text-transparent"
          >
            {displayAddress.pubkey}
          </span>
          <span>@</span>
          <span
            className="bg-gradient-to-r from-cyan-300
            to-indigo-500 bg-clip-text text-transparent"
          >
            {displayAddress.host}
          </span>
        </p>
        <div
          onClick={() => {
            navigator.clipboard.writeText(address).catch((err) => {
              console.error("failed to write to clipboard", err);
            });
            setCopyTextVisible(true);
          }}
        >
          <Button>copy</Button>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default AddressWidget;
