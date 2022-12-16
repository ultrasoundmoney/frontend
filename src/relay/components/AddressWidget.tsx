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
    <WidgetBackground className="w-full">
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
            mt-2 flex flex-col items-center justify-between
            xs:flex-col sm:flex-row
            lg:flex-col xl:flex-row
         `}
      >
        <p className="mb-3 break-all font-roboto font-light text-slateus-200 lg:mb-3 xl:mb-0">
          {displayAddress}
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
