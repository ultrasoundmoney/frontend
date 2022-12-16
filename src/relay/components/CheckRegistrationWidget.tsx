import { type FC, useState } from "react";

import { getApiUrl } from "../config";
import { WidgetBackground } from "../../components/WidgetSubcomponents";
import Button from "../../components/BlueButton";
import LabelText from "../../components/TextsNext/LabelText";

type Status = "initial" | "registered" | "not registered";

const CheckRegistrationWidget: FC = () => {
  const [addr, setAddr] = useState("");
  const [registrationStatus, setRegistrationStatus] =
    useState<Status>("initial");

  const apiUrl = getApiUrl();

  const fetchRegistrationStatus = () => {
    if (addr.length > 0) {
      fetch(`${apiUrl}/api/validators/${addr}`)
        .then((res) => res.json())
        .then(({ status }) => {
          if (status) {
            setRegistrationStatus("registered");
          } else {
            setRegistrationStatus("not registered");
          }
        })
        .catch((err) => {
          console.error("failed to fetch registration status", err);
        });
    }
  };

  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-row items-center justify-between">
        <LabelText>check registration</LabelText>
        <p
          className={`
            font-inter font-light
            ${registrationStatus === "initial" ? "invisible" : "visible"}
            ${
              registrationStatus === "registered"
                ? "text-green-400"
                : "text-red-400"
            }
        `}
        >
          {`${registrationStatus}!`}
        </p>
      </div>
      <div className="mt-2 flex flex-row items-center justify-between">
        <input
          className={`
                 mr-4 w-full rounded-full
                 border border-slateus-500
                 bg-slateus-800 py-1.5 pl-4
                 font-inter text-xs font-light
                 text-white placeholder-slateus-400 outline-none
                 focus-within:border-slateus-400
                 md:py-2 md:text-base
               `}
          placeholder="validator address"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
        />
        <div onClick={fetchRegistrationStatus}>
          <Button>check</Button>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default CheckRegistrationWidget;
