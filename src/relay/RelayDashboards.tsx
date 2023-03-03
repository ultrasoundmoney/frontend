import dynamic from "next/dynamic";
import type { FC } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import colors from "../colors";
import AdminTools from "../components/AdminTools";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import HeaderGlow from "../components/HeaderGlow";
import MainTitle from "../components/MainTitle";
import { getEnv } from "../config";
import { FeatureFlagsContext, useFeatureFlags } from "../feature-flags";
import ContactSection from "../sections/ContactSection";
import AddressWidget from "./components/AddressWidget";
import CheckRegistrationWidget from "./components/CheckRegistrationWidget";
import InclusionsWidget from "./components/InclusionsWidget";
import ValidatorWidget from "./components/ValidatorWidget";
import CensorshipSection from "./sections/CensorshipSection";
import FaqSection from "./sections/FaqSection";
import InclusionDelaySection from "./sections/InclusionDelaySection";
import type {
  Builder,
  Payload,
  PayloadStats,
  Validator,
  ValidatorStats,
} from "./types";

export type RelayDashboardProps = {
  payloadStats: PayloadStats;
  payloads: Array<Payload>;
  topPayloads: Array<Payload>;
  validatorStats: ValidatorStats;
  validators: Array<Validator>;
  topBuilders: Array<Builder>;
};

const env = getEnv();

const RelayDashboard: FC<RelayDashboardProps> = ({
  payloadStats,
  payloads,
  validatorStats,
  validators,
}) => {
  const { featureFlags, setFlag } = useFeatureFlags();

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      <SkeletonTheme
        baseColor={colors.slateus500}
        highlightColor="#565b7f"
        enableAnimation={true}
      >
        <HeaderGlow />
        <div className="container mx-auto">
          <BasicErrorBoundary>
            <AdminTools setFlag={setFlag} />
          </BasicErrorBoundary>
          <div className="h-[48.5px] md:h-[68px]"></div>
          <MainTitle>ultra sound relay</MainTitle>
          {env === "stag" ? (
            <div
              className={`
              mt-4 text-center font-inter text-xl
              font-extralight tracking-wide
              text-slateus-400 sm:mt-0
            `}
            >
              goerli testnet
            </div>
          ) : null}
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
                  payloadCount={payloadStats.count}
                  totalValue={payloadStats.totalValue}
                  firstPayloadAt={new Date(payloadStats.firstPayloadAt)}
                  payloads={payloads}
                />
              </div>
              <div className="flex flex-col lg:w-1/2">
                <ValidatorWidget {...validatorStats} validators={validators} />
              </div>
            </div>
          </div>
          <CensorshipSection />
          <InclusionDelaySection />
          <FaqSection />
          <ContactSection />
        </div>
      </SkeletonTheme>
    </FeatureFlagsContext.Provider>
  );
};

export default RelayDashboard;
