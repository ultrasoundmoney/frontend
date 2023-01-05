import JSBI from "jsbi";
import dynamic from "next/dynamic";
import Head from "next/head";
import type { FC } from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import { useEthPriceStats } from "../../api/eth-price-stats";
import { ethSupplyFromParts, useSupplyParts } from "../../api/eth-supply";
import colors from "../../colors";
import { WEI_PER_GWEI } from "../../eth-units";
import { FeatureFlagsContext, useFeatureFlags } from "../../feature-flags";
import { formatZeroDecimals } from "../../format";
import { PARIS_SUPPLY } from "../../hardforks/paris";
import useAuthFromSection from "../../hooks/use-auth-from-section";
import { useTwitterAuthStatus } from "../../hooks/use-twitter-auth";
import type { TimeFrameNext } from "../../time-frames";
import { getNextTimeFrameNext } from "../../time-frames";
import BasicErrorBoundary from "../BasicErrorBoundary";
import ContactSection from "../ContactSection";
import PoapSection from "../FamPage/PoapSection";
import HeaderGlow from "../HeaderGlow";
import FaqBlock from "../Landing/faq";
import MainTitle from "../MainTitle";
import TopBar from "../TopBar";
import FamSection from "./FamSection";
import JoinDiscordSection from "./JoinDiscordSection";
import SupplyDashboard from "./SupplyDashboard";
import GasSection from "./GasSection";

const AdminTools = dynamic(() => import("../AdminTools"), { ssr: false });
// We get hydration errors in production.
// It's hard to tell what component causes them due to minification.
// We stop SSR on all components, and slowly turn them back on one-by-one to see which cause hydration issues.
// On: MergeSection, JoinDiscordSection
// Off: SupplyDashboard, BurnSection, MonetaryPremiumSection, FamSection, TotalValueSecuredSection.
const TotalValueSecuredSection = dynamic(
  () => import("./TotalValueSecuredSection"),
  { ssr: false },
);
const MonetaryPremiumSection = dynamic(
  () => import("./MonetaryPremiumSection"),
  { ssr: false },
);
const SupplyProjectionsSection = dynamic(
  () => import("./SupplyProjectionsSection"),
  { ssr: false },
);
// Likely culprit.
const BurnSection = dynamic(() => import("./BurnSection"), {
  ssr: false,
});

const useGasPriceTitle = (defaultTitle: string) => {
  const [gasTitle, setGasTitle] = useState<string>();
  const baseFeePerGas = useBaseFeePerGas();
  const ethPriceStats = useEthPriceStats();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      baseFeePerGas === undefined ||
      ethPriceStats === undefined
    ) {
      return undefined;
    }
    const gasFormatted = (baseFeePerGas.wei / WEI_PER_GWEI).toFixed(0);
    const newTitle = `${gasFormatted} Gwei | $${formatZeroDecimals(
      ethPriceStats.usd,
    )} ${defaultTitle}`;
    setGasTitle(newTitle);
  }, [baseFeePerGas, defaultTitle, ethPriceStats]);

  return gasTitle;
};

// By default a browser doesn't scroll to a section with a given ID matching the # in the URL.
const useScrollOnLoad = () => {
  const [authFromSection, setAuthFromSection] = useAuthFromSection();

  useEffect(() => {
    if (typeof window === undefined || typeof document === undefined) {
      return undefined;
    }

    if (authFromSection !== "empty") {
      document
        .querySelector(`#${authFromSection}`)
        ?.scrollIntoView({ behavior: "auto", block: "start" });
      setAuthFromSection("empty");
    }

    if (window.location.hash.length > 0) {
      document
        .querySelector(window.location.hash.toLowerCase())
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    }
    // The useAuthFromSection deps are missing intentionally here, we only want
    // this to run once on load. Because we disable the exhaustive deps linting
    // rule for this reason do check anything you add above doesn't need to be
    // in there.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// This is a component to avoid triggering a render on the whole Dashboard.
const GasPriceTitle = () => {
  const gasPriceTitle = useGasPriceTitle("| ultrasound.money");
  return (
    <Head>
      <title>{gasPriceTitle}</title>
    </Head>
  );
};

const useIsDeflationary = () => {
  const ethSupplyParts = useSupplyParts();
  const ethSupply = JSBI.toNumber(ethSupplyFromParts(ethSupplyParts)) / 1e18;
  const [isDeflationary, setIsDeflationary] = useState(false);
  const { simulateDeflationary } = useContext(FeatureFlagsContext);

  useEffect(() => {
    if (ethSupply > PARIS_SUPPLY) {
      setIsDeflationary(false);
      return;
    }

    setIsDeflationary(true);
  }, [ethSupply, setIsDeflationary]);

  // simulateDeflationary doesn't work in the Dashboard component as the FeatureFlagsContext is not available.
  return isDeflationary || simulateDeflationary;
};

const Dashboard: FC = () => {
  useScrollOnLoad();
  const { featureFlags, setFlag } = useFeatureFlags();
  const [twitterAuthStatus, setTwitterAuthStatus] = useTwitterAuthStatus();
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const isDeflationary = useIsDeflationary();
  const videoEl = useRef<HTMLVideoElement>(null);
  const { simulateDeflationary } = featureFlags;
  const showVideo = isDeflationary || simulateDeflationary;

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => getNextTimeFrameNext(timeFrame));
  }, []);

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const handleToggleBatLoop = useCallback(() => {
    if (videoEl.current === null) {
      return;
    }

    videoEl.current.paused
      ? videoEl.current.play().catch(console.error)
      : videoEl.current.pause();
  }, []);

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      <SkeletonTheme
        baseColor={colors.slateus500}
        highlightColor="#565b7f"
        enableAnimation={true}
      >
        <GasPriceTitle />
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
          {showVideo && (
            <video
              ref={videoEl}
              className={`
                absolute left-0 right-0 top-10 -z-10 mx-auto
                md:-top-10
                ${isDeflationary || simulateDeflationary ? "" : "hidden"}
              `}
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/bat-480.mov" type="video/mp4;codecs=hvc1" />
              <source src="/bat-480.webm" type="video/webm" />
            </video>
          )}
          <MainTitle onClick={handleToggleBatLoop}>ultra sound money</MainTitle>
          <SupplyDashboard
            timeFrame={timeFrame}
            onSetTimeFrame={handleSetTimeFrame}
            onClickTimeFrame={handleClickTimeFrame}
          />
          <GasSection
            timeFrame={timeFrame}
            onClickTimeFrame={handleClickTimeFrame}
          />
          <SupplyProjectionsSection />
          <div className="h-16"></div>
          <BurnSection />
          <div className="h-16"></div>
          <TotalValueSecuredSection />
          <div className="h-16"></div>
          <MonetaryPremiumSection />
          <FamSection />
          <PoapSection
            setTwitterAuthStatus={setTwitterAuthStatus}
            twitterAuthStatus={twitterAuthStatus}
          />
          <JoinDiscordSection
            setTwitterAuthStatus={setTwitterAuthStatus}
            twitterAuthStatus={twitterAuthStatus}
          />
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
