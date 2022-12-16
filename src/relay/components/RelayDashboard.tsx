import { FC } from "react";

import HeaderGlow from "../../components/HeaderGlow";
import MainTitle from "../../components/MainTitle";
import AddressWidget from "./AddressWidget";
import CheckRegistrationWidget from "./CheckRegistrationWidget";
import InclusionsWidget from "./InclusionsWidget";
import ValidatorWidget from "./ValidatorWidget";
import FaqSection from "./FaqSection";
import ContactSection from "../../components/ContactSection";

type ApiPayload = {
  insertedAt: Date;
  blockNumber: number;
  value: number;
};

type ApiValidator = {
  insertedAt: Date;
  pubkeyFragment: string;
};

export type RelayDashboardProps = {
  payloadCount: number;
  payloads: Array<ApiPayload>;
  validatorCount: number;
  validators: Array<ApiValidator>;
};

const RelayDashboard: FC<RelayDashboardProps> = ({
  payloadCount,
  payloads,
  validatorCount,
  validators,
}) => {
  return (
    <>
      <HeaderGlow />
      <div className="container mx-auto">
        <div className="h-[48.5px] md:h-[68px]"></div>
        <MainTitle>ultra sound relay</MainTitle>
        <div className="mt-16 mb-32 flex flex-col gap-y-4 xs:px-4 md:px-16">
          <div className="mt-16 flex flex-col gap-x-4 gap-y-4 lg:flex-row">
            <div className="flex lg:w-1/2">
              <AddressWidget />
            </div>
            <div className="flex lg:w-1/2">
              <CheckRegistrationWidget />
            </div>
          </div>
          <div className="flex flex-col gap-x-4 gap-y-4 lg:flex-row">
            <div className="flex flex-col lg:w-1/2">
              <InclusionsWidget
                payloadCount={payloadCount}
                payloads={payloads}
              />
            </div>
            <div className="flex flex-col lg:w-1/2">
              <ValidatorWidget
                validatorCount={validatorCount}
                validators={validators}
              />
            </div>
          </div>
        </div>
        <FaqSection />
        <ContactSection />
      </div>
    </>
  );
};

export default RelayDashboard;
