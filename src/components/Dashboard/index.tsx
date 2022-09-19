import dynamic from "next/dynamic";
import Head from "next/head";
import type { FC } from "react";
import { Suspense, useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { BaseFeePerGas } from "../../api/base-fee-per-gas";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import type { EthPriceStats } from "../../api/eth-price-stats";
import { useEthPriceStats } from "../../api/eth-price-stats";
import type { EthSupplyF } from "../../api/eth-supply";
import { decodeEthSupply, useEthSupply } from "../../api/eth-supply";
import type { MergeEstimate } from "../../api/merge-estimate";
import { useMergeEstimate } from "../../api/merge-estimate";
import type { MergeStatus } from "../../api/merge-status";
import { useMergeStatus } from "../../api/merge-status";
import { useScarcity } from "../../api/scarcity";
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
import StyledLink from "../Link";
import MainTitle from "../MainTitle";
import SectionDivider from "../SectionDivider";
import { TextInterLink } from "../Texts";
import TopBar from "../TopBar";
import JoinDiscordSection from "./JoinDiscordSection";
import MergeSection from "./MergeSection";
const AdminTools = dynamic(() => import("../AdminTools"));
import confettiSvg from "../../assets/confetti-own.svg";
import pandaSvg from "../../assets/panda-own.svg";
import type { StaticImageData } from "next/image";
import Image from "next/image";

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
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
  ethSupplyF: EthSupplyF;
  mergeEstimate: MergeEstimate;
  mergeStatus: MergeStatus;
};

const Dashboard: FC<Props> = ({
  baseFeePerGas,
  ethPriceStats,
  ethSupplyF,
  mergeEstimate,
  mergeStatus,
}) => {
  const crMergeEstimate = useClientRefreshed(mergeEstimate, useMergeEstimate);
  const crEthSupply = useClientRefreshed(ethSupplyF, useEthSupply);
  const ethSupply = decodeEthSupply(crEthSupply);
  const scarcity = useScarcity();
  const { featureFlags, setFlag } = FeatureFlags.useFeatureFlags();
  const adminToken = useAdminToken();
  const crBaseFeePerGas = useClientRefreshed(baseFeePerGas, useBaseFeePerGas);
  const crEthPriceStats = useClientRefreshed(ethPriceStats, useEthPriceStats);
  const gasTitle = useGasTitle(
    "dashboard | ultrasound.money",
    crBaseFeePerGas.wei,
  );
  const crMergeStatus = useClientRefreshed(mergeStatus, useMergeStatus);
  useScrollOnLoad();

  const mergeProxyStatus = featureFlags.simulatePostMerge
    ? ({
        status: "merged",
        timestamp: "2022-09-15T03:32:00Z",
        block_number: 15537349,
        supply: 120517942,
      } as const)
    : crMergeStatus;

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
          <MainTitle>ultra sound money</MainTitle>
          <div className="flex mx-auto items-center justify-center mb-16 gap-x-8">
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
            <p className="font-inter font-light text-blue-spindle text-xl md:text-2xl lg:text-3xl text-center">
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
          <MergeSection
            ethSupply={ethSupply}
            mergeEstimate={crMergeEstimate}
            mergeStatus={mergeProxyStatus}
          />
          <SupplyGrowthSection
            ethSupply={ethSupply}
            ethPriceStats={ethPriceStats}
            scarcity={scarcity}
          />
          <SupplyProjectionsSection
            ethPriceStats={ethPriceStats}
            scarcity={scarcity}
          />
          <div className="h-16"></div>
          <BurnSection />
          <div className="h-16"></div>
          <TotalValueSecuredSection ethPriceStats={ethPriceStats} />
          <div className="h-16"></div>
          <MonetaryPremiumSection ethPriceStats={ethPriceStats} />
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
