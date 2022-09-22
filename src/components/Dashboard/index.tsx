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
import PoapSection from "../FamPage/PoapSection";
import ContactSection from "./ContactSection";
import JoinDiscordSection from "./JoinDiscordSection";

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
          <div className="mx-auto mb-16 flex items-center justify-center gap-x-8">
            <div className="flex gap-x-2">
              <Image
                alt="confetti celebrating merge"
                width={56}
                height={56}
                src={confettiSvg as StaticImageData}
              />
              <Image
                alt="panda symbolizing merge"
                width={40}
                height={40}
                src={pandaSvg as StaticImageData}
              />
            </div>
            <p className="text-center font-inter text-xl font-light text-blue-spindle md:text-2xl lg:text-3xl">
              merged
            </p>
            <div className="flex gap-x-2">
              <Image
                alt="panda symbolizing merge"
                width={40}
                height={40}
                src={pandaSvg as StaticImageData}
              />
              <Image
                alt="confetti celebrating merge"
                width={56}
                height={56}
                src={confettiSvg as StaticImageData}
              />
            </div>
          </div>
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
          <PoapSection />
          <JoinDiscordSection />
          <div className="mt-32 flex px-4 md:px-0">
            <div className="relative w-full md:m-auto lg:w-2/3">
              <FaqBlock />
            </div>
          </div>
          <ContactSection />
        </div>
      </SkeletonTheme>
    </FeatureFlagsContext.Provider>
  );
};

export default Dashboard;
