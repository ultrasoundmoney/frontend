import dynamic from "next/dynamic";
import Head from "next/head";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import colors from "../../colors";
import * as FeatureFlags from "../../feature-flags";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import BasicErrorBoundary from "../BasicErrorBoundary";
import HeaderGlow from "../HeaderGlow";
import FaqBlock from "../Landing/faq";
import StyledLink from "../StyledLink";
import MainTitle from "../MainTitle";
import SectionDivider from "../SectionDivider";
import { TextInterLink } from "../Texts";
import TopBar from "../TopBar";
import MergeSection from "./MergeSection";
import confettiSvg from "../../assets/confetti-own.svg";
import pandaSvg from "../../assets/panda-own.svg";
import type { StaticImageData } from "next/image";
import Image from "next/image";

const AdminTools = dynamic(() => import("../AdminTools"), { ssr: false });
// We get hydration errors in production.
// It's hard to tell what component causes them due to minification.
// We stop SSR on all components, and slowly turn them back on one-by-one to see which cause hydration issues.
// On: MergeSection, JoinDiscordSection
// Off: SupplySection, BurnSection, MonetaryPremiumSection, FamSection, TotalValueSecuredSection.
const TotalValueSecuredSection = dynamic(
  () => import("./TotalValueSecuredSection"),
  { ssr: false },
);
const MonetaryPremiumSection = dynamic(
  () => import("./MonetaryPremiumSection"),
  { ssr: false },
);
const FamSection = dynamic(() => import("./FamSection"), { ssr: false });
const SupplyProjectionsSection = dynamic(
  () => import("./SupplyProjectionsSection"),
  { ssr: false },
);
const SupplyGrowthSection = dynamic(() => import("./SupplyGrowthSection"), {
  ssr: false,
});
// Likely culprit.
const BurnSection = dynamic(() => import("./BurnSection"), {
  ssr: false,
});

const useGasTitle = (defaultTitle: string) => {
  const [gasTitle, setGasTitle] = useState<string>();
  const baseFeePerGas = useBaseFeePerGas();

  useEffect(() => {
    if (typeof window === "undefined" || baseFeePerGas === undefined) {
      return undefined;
    }
    const gasFormatted = Format.gweiFromWei(baseFeePerGas.wei).toFixed(0);
    const newTitle = `${gasFormatted} Gwei | ${defaultTitle}`;
    setGasTitle(newTitle);
  }, [baseFeePerGas, defaultTitle]);

  return gasTitle;
};

// By default a browser doesn't scroll to a section with a given ID matching the # in the URL.
const useScrollOnLoad = () => {
  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      typeof window !== "undefined" &&
      window.location.hash.length > 0
    ) {
      document
        .querySelector(window.location.hash)
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);
};

const Dashboard: FC = () => {
  const { featureFlags, setFlag } = FeatureFlags.useFeatureFlags();
  const gasTitle = useGasTitle("dashboard | ultrasound.money");
  useScrollOnLoad();

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      <SkeletonTheme
        baseColor={colors.slateus500}
        highlightColor={"#565b7f"}
        enableAnimation={true}
      >
        <Head>
          <title>{gasTitle}</title>
        </Head>
        <HeaderGlow />
        <div className="container mx-auto">
          <BasicErrorBoundary>
            <AdminTools setFlag={setFlag} />
          </BasicErrorBoundary>
          <div className="px-4 md:px-16">
            <BasicErrorBoundary>
              <TopBar />
            </BasicErrorBoundary>
          </div>
          <MainTitle>ultra sound money</MainTitle>
          <MergeSection />
          <SupplyGrowthSection />
          <SupplyProjectionsSection />
          <div className="h-16"></div>
          <BurnSection />
          <div className="h-16"></div>
          <TotalValueSecuredSection />
          <div className="h-16"></div>
          <MonetaryPremiumSection />
          <FamSection />
          <div className="flex px-4 md:px-0 mt-32">
            <div className="w-full lg:w-2/3 md:m-auto relative">
              <FaqBlock />
            </div>
          </div>
          <div className="w-full flex flex-col items-center pb-40">
            <SectionDivider title="still have questions?" />
            <div className="flex flex-col gap-y-4 justify-start">
              <div className="flex gap-2 items-center">
                <img
                  className="w-4"
                  src="/twitter-icon.svg"
                  alt="icon of the twitter bird"
                />
                <StyledLink
                  className="flex items-center gap-x-2"
                  enableHover={false}
                  href="https://twitter.com/ultrasoundmoney/"
                >
                  <TextInterLink>DM us @ultrasoundmoney</TextInterLink>
                </StyledLink>
              </div>
              <div className="flex gap-2 items-center">
                <img
                  className="h-4"
                  src="/email-icon.svg"
                  alt="icon of an envelope, email"
                />
                <StyledLink
                  className="flex items-center gap-x-2"
                  enableHover={false}
                  href="mailto:contact@ultrasound.money"
                >
                  <TextInterLink>contact@ultrasound.money</TextInterLink>
                </StyledLink>
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </FeatureFlagsContext.Provider>
  );
};

export default Dashboard;
