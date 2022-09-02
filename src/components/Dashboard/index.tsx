import dynamic from "next/dynamic";
import Head from "next/head";
import type { FC, ReactNode } from "react";
import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAdminToken } from "../../hooks/use-admin-token";
import type { EthSupplyF } from "../../api/eth-supply";
import { decodeEthSupply, useEthSupply } from "../../api/eth-supply";
import type { GroupedAnalysis1F } from "../../api/grouped-analysis-1";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../../api/grouped-analysis-1";
import type { MergeEstimate } from "../../api/merge-estimate";
import { useMergeEstimate } from "../../api/merge-estimate";
import { useScarcity } from "../../api/scarcity";
import { useTotalDifficultyProgress } from "../../api/total-difficulty-progress";
import colors from "../../colors";
import type { Gwei } from "../../eth-units";
import * as FeatureFlags from "../../feature-flags";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import BasicErrorBoundary from "../BasicErrorBoundary";
import Link from "../Link";
import SectionDivider from "../SectionDivider";
import { TextInterLink } from "../Texts";
import TopBar from "../TopBar";
import styles from "./Dashboard.module.scss";
import MergeSection from "./MergeSection";
import MonetaryPremiumSection from "./MonetaryPremiumSection";
import JoinDiscordSection from "./JoinDiscordSection";
import FaqBlock from "../Landing/faq";
import FamSection from "./FamSection";
import BurnSection from "./BurnSection";
import HeaderGlow from "../HeaderGlow";
const AdminTools = dynamic(() => import("../AdminTools"));
const SupplyWidgets = dynamic(() => import("../SupplyWidgets"));
const TotalValueSecured = dynamic(() => import("../TotalValueSecured"));

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

const useGasTitle = (defaultTitle: string, baseFeePerGas: Gwei | undefined) => {
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

const useClientRefreshed = <A,>(
  init: A,
  refreshHook: () => A | undefined,
): A => {
  const refreshed = refreshHook();
  return useMemo(() => refreshed ?? init, [init, refreshed]);
};

type Props = {
  groupedAnalysis1F: GroupedAnalysis1F;
  ethSupplyF: EthSupplyF;
  mergeEstimate: MergeEstimate;
  // totalDifficultyProgress: TotalDifficultyProgress;
};

const Dashboard: FC<Props> = ({
  ethSupplyF,
  groupedAnalysis1F,
  mergeEstimate,
  // totalDifficultyProgress,
}) => {
  const totalDifficultyProgress = useTotalDifficultyProgress();
  const crMergeEstimate = useClientRefreshed(mergeEstimate, useMergeEstimate);
  const crEthSupply = useClientRefreshed(ethSupplyF, useEthSupply);
  const decodedCrEthSupply = decodeEthSupply(crEthSupply);
  const crGroupedAnalysis = useClientRefreshed(
    groupedAnalysis1F,
    useGroupedAnalysis1,
  );
  const groupedAnalysis1 = decodeGroupedAnalysis1(crGroupedAnalysis);
  const scarcity = useScarcity();
  const { featureFlags, setFlag } = FeatureFlags.useFeatureFlags();
  const adminToken = useAdminToken();
  const gasTitle = useGasTitle(
    "dashboard | ultrasound.money",
    groupedAnalysis1?.baseFeePerGas,
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
                <TopBar groupedAnalysis1={groupedAnalysis1} />
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
            <BasicErrorBoundary>
              <Suspense>
                <MergeSection
                  ethSupply={decodedCrEthSupply}
                  mergeEstimate={crMergeEstimate}
                  totalDifficultyProgress={totalDifficultyProgress}
                />
              </Suspense>
            </BasicErrorBoundary>
            <BasicErrorBoundary>
              <Suspense>
                <div id="projection">
                  <SectionDivider
                    link="projection"
                    subtitle="ultra sound money for years to come"
                    title="supply projections"
                  />
                  <SupplyWidgets
                    scarcity={scarcity}
                    groupedAnalysis1={groupedAnalysis1}
                  />
                </div>
              </Suspense>
            </BasicErrorBoundary>
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
            <div className="xs:px-4 md:px-16" id="tvs">
              <SectionDivider
                title="total value secured—TVS"
                link="tvs"
                subtitle="securing the internet of value"
              />
              <BasicErrorBoundary>
                <Suspense>
                  <div className="flex flex-col" id="tvs">
                    <TotalValueSecured></TotalValueSecured>
                  </div>
                </Suspense>
              </BasicErrorBoundary>
            </div>
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
