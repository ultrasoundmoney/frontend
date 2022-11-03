import dynamic from "next/dynamic";
import Head from "next/head";
import type { FC } from "react";
import { useContext } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import { useEthPriceStats } from "../../api/eth-price-stats";
import colors from "../../colors";
import { WEI_PER_GWEI } from "../../eth-units";
import { FeatureFlagsContext, useFeatureFlags } from "../../feature-flags";
import { formatZeroDecimals } from "../../format";
import useAuthFromSection from "../../hooks/use-auth-from-section";
import { useTwitterAuthStatus } from "../../hooks/use-twitter-auth";
import type { TimeFrameNext } from "../../time-frames";
import { getNextTimeFrame } from "../../time-frames";
import BasicErrorBoundary from "../BasicErrorBoundary";
import PoapSection from "../FamPage/PoapSection";
import HeaderGlow from "../HeaderGlow";
import FaqBlock from "../Landing/faq";
import MainTitle from "../MainTitle";
import TopBar from "../TopBar";
import ContactSection from "../ContactSection";
import FamSection from "./FamSection";
import JoinDiscordSection from "./JoinDiscordSection";
import SupplySection from "./SupplySection";
import ConfettiGenerator from "confetti-js";
import { PARIS_SUPPLY } from "../../hardforks/paris";
import { useSupplyOverTime } from "../../api/supply-over-time";
import _last from "lodash/last";

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
const SupplyProjectionsSection = dynamic(
  () => import("./SupplyProjectionsSection"),
  { ssr: false },
);
const GasSection = dynamic(() => import("./GasSection"), {
  ssr: false,
});
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
  const supplyOverTime = useSupplyOverTime();
  const supplySinceMerge = supplyOverTime?.since_merge;
  const lastSupply = _last(supplySinceMerge);
  const [isDeflationary, setIsDeflationary] = useState(false);
  const { simulateDeflationary } = useContext(FeatureFlagsContext);

  useEffect(() => {
    if (lastSupply === undefined) {
      return;
    }

    if (lastSupply.supply > PARIS_SUPPLY) {
      setIsDeflationary(false);
      return;
    }

    setIsDeflationary(true);
  }, [setIsDeflationary, lastSupply]);

  // simulateDeflationary doesn't work in the Dashboard component as the FeatureFlagsContext is not available.
  return isDeflationary || simulateDeflationary;
};

type UseConfetti = { showConfetti: boolean };

const useConfetti = (simulateDeflationary: boolean): UseConfetti => {
  const [confettiRan, setConfettiRan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const isDeflationary = useIsDeflationary();

  useEffect(() => {
    if (
      confettiRan ||
      typeof document === "undefined" ||
      (!isDeflationary && !simulateDeflationary)
    ) {
      return;
    }

    // If confetti hasn't ran and last supply is under merge supply, run
    setShowConfetti(true);
    setConfettiRan(true);

    const confettiSettings = {
      target: "confetti-canvas",
      max: 20,
      width: document.body.clientWidth,
      height: 1400,
      props: [{ type: "svg", src: "/bat-own.svg" }],
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const confetti = new ConfettiGenerator(confettiSettings) as {
      render: () => void;
      clear: () => void;
    };
    confetti.render();

    setTimeout(() => {
      confetti.clear();
    }, 22000);

    return;
  }, [isDeflationary, confettiRan, simulateDeflationary]);

  return { showConfetti };
};

const Dashboard: FC = () => {
  useScrollOnLoad();
  const { featureFlags, setFlag } = useFeatureFlags();
  const [twitterAuthStatus, setTwitterAuthStatus] = useTwitterAuthStatus();
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const isDeflationary = useIsDeflationary();
  const videoEl = useRef<HTMLVideoElement>(null);
  const { simulateDeflationary } = featureFlags;
  const { showConfetti } = useConfetti(simulateDeflationary);
  const showVideo = isDeflationary || simulateDeflationary;

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => getNextTimeFrame(timeFrame));
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

  useEffect(() => {
    if (!showVideo || typeof window === "undefined") {
      return;
    }

    const id = setTimeout(() => {
      if (videoEl.current === null) {
        return;
      }
      videoEl.current.pause();
    }, 22000);
    return () => window.clearTimeout(id);
  }, [showVideo]);

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      <SkeletonTheme
        baseColor={colors.slateus500}
        highlightColor="#565b7f"
        enableAnimation={true}
      >
        <GasPriceTitle />
        <HeaderGlow />
        
        <div className="confetti-container absolute bottom-0 top-0 left-0 right-0 overflow-hidden pointer-events-none z-10">
          <canvas
            className={showConfetti ? "" : "hidden"}
            id="confetti-canvas"
          ></canvas>
        </div>
        
        <div className="container mx-auto">
          <BasicErrorBoundary>
            <AdminTools setFlag={setFlag} />
          </BasicErrorBoundary>
          <div className="px-4 md:px-16">
            <BasicErrorBoundary>
              <TopBar />
            </BasicErrorBoundary>
          </div>
          {showVideo &&
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
          }
          <MainTitle onClick={handleToggleBatLoop}>ultra sound money</MainTitle>
          <SupplySection
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
