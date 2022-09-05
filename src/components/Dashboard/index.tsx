import dynamic from "next/dynamic";
import Head from "next/head";
import type { FC, ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { BaseFeePerGas } from "../../api/base-fee-per-gas";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import type { EthPriceStats } from "../../api/eth-price-stats";
import { useEthPriceStats } from "../../api/eth-price-stats";
import type { EthSupplyF } from "../../api/eth-supply";
import { decodeEthSupply, useEthSupply } from "../../api/eth-supply";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../../api/grouped-analysis-1";
import type { MergeEstimate } from "../../api/merge-estimate";
import { useMergeEstimate } from "../../api/merge-estimate";
import { useScarcity } from "../../api/scarcity";
import { useTotalDifficultyProgress } from "../../api/total-difficulty-progress";
import colors from "../../colors";
import type { WeiNumber } from "../../eth-units";
import * as FeatureFlags from "../../feature-flags";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import { useAdminToken } from "../../hooks/use-admin-token";
import { useClientRefreshed } from "../../hooks/use-client-refreshed";
import BasicErrorBoundary from "../BasicErrorBoundary";
import HeaderGlow from "../HeaderGlow";
import FaqBlock from "../Landing/faq";
import Link from "../Link";
import SectionDivider from "../SectionDivider";
import { TextInterLink } from "../Texts";
import TopBar from "../TopBar";
import styles from "./Dashboard.module.scss";
import MergeSection from "./MergeSection";
const AdminTools = dynamic(() => import("../AdminTools"));

// We get hydration errors in production.
// It's hard to tell what component causes them due to minification.
// We stop SSR on all components, and slowly turn them back on one-by-one to see which cause hydration issues.
// On: none
// Off: SupplySection, BurnSection, MonetaryPremiumSection, JoinDiscordSection, FamSection, TotalValueSecuredSection, MergeSection.
const TotalValueSecuredSection = dynamic(
  () => import("./TotalValueSecuredSection"),
  { ssr: false },
);
const MonetaryPremiumSection = dynamic(
  () => import("./MonetaryPremiumSection"),
  { ssr: false },
);
const FamSection = dynamic(() => import("./FamSection"), { ssr: false });
const SupplySection = dynamic(() => import("./SupplySection"), { ssr: false });
const BurnSection = dynamic(() => import("./BurnSection"), { ssr: false });
const JoinDiscordSection = dynamic(() => import("./JoinDiscordSection"), {
  ssr: false,
});

const Title: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className={`
      bg-transparent
      font-extralight
      text-white text-center
      mt-16 mb-8 mx-auto px-4 md:px-16
      text-[4.6rem]
      md:text-[4.0rem]
      lg:text-[4.8rem]
      leading-[5.4rem]
      md:leading-[5.4rem]
      ${styles.gradientText}
    `}
  >
    {children}
  </div>
);

const useGasTitle = (defaultTitle: string, baseFeePerGas: WeiNumber) => {
  const [gasTitle, setGasTitle] = useState<string>();

  useEffect(() => {
    if (typeof window === "undefined" || baseFeePerGas === undefined) {
      return undefined;
    }
    const gasFormatted = Format.gweiFromWei(baseFeePerGas).toFixed(0);
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

type Props = {
  // totalDifficultyProgress: TotalDifficultyProgress;
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
  ethSupplyF: EthSupplyF;
  mergeEstimate: MergeEstimate;
};

const Dashboard: FC<Props> = ({
  baseFeePerGas,
  ethPriceStats,
  ethSupplyF,
  mergeEstimate,
  // totalDifficultyProgress,
}) => {
  const totalDifficultyProgress = useTotalDifficultyProgress();
  const crMergeEstimate = useClientRefreshed(mergeEstimate, useMergeEstimate);
  const crEthSupply = useClientRefreshed(ethSupplyF, useEthSupply);
  const decodedCrEthSupply = decodeEthSupply(crEthSupply);
  const scarcity = useScarcity();
  const { featureFlags, setFlag } = FeatureFlags.useFeatureFlags();
  const adminToken = useAdminToken();
  const crBaseFeePerGas = useClientRefreshed(baseFeePerGas, useBaseFeePerGas);
  const crEthPriceStats = useClientRefreshed(ethPriceStats, useEthPriceStats);
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);
  const gasTitle = useGasTitle(
    "dashboard | ultrasound.money",
    crBaseFeePerGas.wei,
  );
  useScrollOnLoad();

  return (
    <BasicErrorBoundary>
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
            {adminToken && (
              <BasicErrorBoundary>
                <Suspense>
                  <AdminTools setFlag={setFlag} />
                </Suspense>
              </BasicErrorBoundary>
            )}
            <div className="px-4 xs:px-4 md:px-16">
              <BasicErrorBoundary>
                <TopBar
                  baseFeePerGas={crBaseFeePerGas}
                  ethPriceStats={crEthPriceStats}
                  initialBaseFeePerGas={baseFeePerGas.wei}
                  initialEthPrice={ethPriceStats.usd}
                />
              </BasicErrorBoundary>
            </div>
            <Title>Ultra Sound Money</Title>
            <p className="font-inter font-light text-blue-spindle text-xl md:text-2xl lg:text-3xl text-center mb-16">
              merge soon™
            </p>
            {featureFlags.showBackgroundOrbs && (
              <video
                className="absolute hidden md:block left-0 -ml-24 md:top-96 lg:top-96 opacity-20 -z-10"
                playsInline
                autoPlay
                muted
                loop
                poster="/orbs1.jpg"
              >
                <source src="/orbs1.webm" type="video/webm; codecs='vp9'" />
                <source src="/orbs1.mp4" type="video/mp4" />
              </video>
            )}
            <MergeSection
              ethSupply={decodedCrEthSupply}
              mergeEstimate={crMergeEstimate}
              totalDifficultyProgress={totalDifficultyProgress}
            />
            <SupplySection
              burnRates={groupedAnalysis1.burnRates}
              ethPriceStats={ethPriceStats}
              scarcity={scarcity}
            />
            <div className="h-16"></div>
            <BurnSection groupedAnalysis1={groupedAnalysis1} />
            {featureFlags.showBackgroundOrbs && (
              <video
                className="absolute w-1/2 right-0 -mt-64 opacity-20 -z-10"
                playsInline
                autoPlay
                muted
                loop
                poster="/orbs2.jpg"
              >
                <source src="/orbs2.webm" type="video/webm; codecs='vp9'" />
                <source src="/orbs2.mp4" type="video/mp4" />
              </video>
            )}
            <div className="h-16"></div>
            <TotalValueSecuredSection ethPriceStats={ethPriceStats} />
            <div className="h-16"></div>
            {featureFlags.showBackgroundOrbs && (
              <video
                className="absolute w-1/2 -left-20 -mt-96 opacity-20 -z-10 -mr-8"
                playsInline
                autoPlay
                muted
                loop
                poster="/orbs1.jpg"
              >
                <source src="/orbs1.webm" type="video/webm; codecs='vp9'" />
                <source src="/orbs1.mp4" type="video/mp4" />
              </video>
            )}
            <MonetaryPremiumSection groupedAnalysis1={groupedAnalysis1} />
            <FamSection />
            <JoinDiscordSection />
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
                  <Link
                    className="flex items-center gap-x-2"
                    enableHover={false}
                    href="https://twitter.com/ultrasoundmoney/"
                  >
                    <TextInterLink>DM us @ultrasoundmoney</TextInterLink>
                  </Link>
                </div>
                <div className="flex gap-2 items-center">
                  <img
                    className="h-4"
                    src="/email-icon.svg"
                    alt="icon of an envelope, email"
                  />
                  <Link
                    className="flex items-center gap-x-2"
                    enableHover={false}
                    href="mailto:contact@ultrasound.money"
                  >
                    <TextInterLink>contact@ultrasound.money</TextInterLink>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </FeatureFlagsContext.Provider>
    </BasicErrorBoundary>
  );
};

export default Dashboard;
