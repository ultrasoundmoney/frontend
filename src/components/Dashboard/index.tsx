import * as Sentry from "@sentry/react";
import type { FC, ReactNode } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAdminToken } from "../../admin";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import Colors from "../../colors";
import type { Gwei } from "../../eth-units";
import * as FeatureFlags from "../../feature-flags";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import WidgetGroup1 from "../BurnGroup";
import Flippenings from "../Flippenings";
import FollowingYou from "../FollowingYou";
import IssuanceBreakdown from "../IssuanceBreakdown";
import FaqBlock from "../Landing/faq";
import Link from "../Link";
import PriceModel from "../PriceModel";
import Scarcity from "../Scarcity";
import SupplyWidgets from "../SupplyWidgets";
import { SectionTitle, TextInterLink, TextRoboto } from "../Texts";
import ToggleSwitch from "../ToggleSwitch";
import TopBar from "../TopBar";
import TotalValueSecured from "../TotalValueSecured";
import TwitterFam from "../TwitterFam";
import ValidatorRewardsWidget from "../ValidatorRewards";
import { WidgetTitle } from "../WidgetSubcomponents";
import styles from "./Dashboard.module.scss";
import Image from "next/image";
import headerGlowSvg from "./blurred-bg.svg";
import type { StaticImageData } from "next/image";

const SectionDivider: FC<{
  link?: string;
  subtitle?: string;
  title: string;
}> = ({ link, title, subtitle }) => (
  <>
    <div className="h-16"></div>
    {/* We use two h-16 divs because it makes the page look better when linking to the section */}
    <div className="h-16" id={link}></div>
    <SectionTitle link={link} title={title} subtitle={subtitle} />
    <div className="h-16"></div>
  </>
);

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

const AdminTools: FC<{
  setFlag: ({
    flag,
    enabled,
  }: {
    flag: FeatureFlags.Flag;
    enabled: boolean;
  }) => void;
}> = ({ setFlag }) => {
  const [minimizeFlags, setMinimizeFlags] = useState(false);
  const featureFlags: FeatureFlags.FeatureFlags = useContext(
    FeatureFlags.FeatureFlagsContext,
  );

  return (
    <div
      className={`
        fixed bottom-4 left-4
        bg-blue-tangaroa rounded-lg
        p-4 z-20
        border-2 border-slate-600
      transition-transform
        ${minimizeFlags ? "translate-y-[88%]" : ""}
      `}
    >
      <div className="flex justify-between items-center">
        <WidgetTitle>feature flags</WidgetTitle>
        <div className="" onClick={() => setMinimizeFlags(!minimizeFlags)}>
          <TextRoboto
            className={`text-xl px-2 ${minimizeFlags ? "hidden" : ""}`}
          >
            ↓
          </TextRoboto>
          <TextRoboto
            className={`text-xl px-2 ${minimizeFlags ? "" : "hidden"}`}
          >
            ↑
          </TextRoboto>
        </div>
      </div>
      {FeatureFlags.flags.map((flag) => (
        <div
          key={flag}
          className="flex items-center justify-between gap-x-4 mt-4"
        >
          <span className="text-white mr-4">
            {FeatureFlags.displayFlagMap[flag]}
          </span>
          <ToggleSwitch
            checked={featureFlags[flag]}
            onToggle={(enabled) => setFlag({ flag, enabled })}
          ></ToggleSwitch>
        </div>
      ))}
    </div>
  );
};

const StyledErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => (
  <Sentry.ErrorBoundary
    fallback={
      <div
        className={`
          w-5/6 m-auto p-8 rounded-lg font-roboto text-white text-base text-center
          border border-red-400
        `}
      >
        an error occured we did not foresee, if this does not change soon,
        please tell us!
      </div>
    }
  >
    {children}
  </Sentry.ErrorBoundary>
);

const useGasTitle = (baseFeePerGas: Gwei | undefined) => {
  const originalTitle = useRef<string>();

  useEffect(() => {
    if (typeof window === "undefined" || baseFeePerGas === undefined) {
      return undefined;
    }

    if (originalTitle.current === undefined) {
      originalTitle.current = document.title;
    }

    const gasFormatted = Format.gweiFromWei(baseFeePerGas).toFixed(0);
    const newTitle = `${gasFormatted} Gwei | ${originalTitle.current}`;
    document.title = newTitle;
  }, [baseFeePerGas]);
};

const Dashboard: FC = () => {
  const groupedAnalysis1 = useGroupedAnalysis1();
  const { featureFlags, setFlag } = FeatureFlags.useFeatureFlags();
  const adminToken = useAdminToken();
  useGasTitle(groupedAnalysis1?.baseFeePerGas);

  return (
    <StyledErrorBoundary>
      <FeatureFlagsContext.Provider value={featureFlags}>
        <SkeletonTheme
          baseColor={Colors.dusk}
          highlightColor="#565b7f"
          enableAnimation={true}
        >
            <div className="container mx-auto">
              {adminToken && (
                <StyledErrorBoundary>
                  <AdminTools setFlag={setFlag} />
                </StyledErrorBoundary>
              )}
              <div className="px-4 md:px-16">
                <StyledErrorBoundary>
                  <TopBar />
                </StyledErrorBoundary>
              </div>
              <Title>Ultra Sound Money</Title>
              <p className="font-inter font-light text-blue-spindle text-xl md:text-2xl lg:text-3xl text-center mb-16">
                merge soon™
              </p>
              {/* <video */}
              {/*   className="w-full md:w-3/6 lg:w-2/6 mx-auto -mt-32 -mb-4 pr-6 mix-blend-lighten" */}
              {/*   playsInline */}
              {/*   autoPlay */}
              {/*   muted */}
              {/*   loop */}
              {/*   poster="/bat-no-wings.png" */}
              {/* > */}
              {/*   <source */}
              {/*     src="/bat-no-wings.webm" */}
              {/*     type="video/webm; codecs='vp9'" */}
              {/*   /> */}
              {/*   <source src="/bat-no-wings.mp4" type="video/mp4" /> */}
              {/* </video> */}
              {/* <video */}
              {/*   className="absolute hidden md:block left-0 -ml-24 md:top-96 lg:top-96 opacity-20 -z-10" */}
              {/*   playsInline */}
              {/*   autoPlay */}
              {/*   muted */}
              {/*   loop */}
              {/*   poster="/orbs1.jpg" */}
              {/* > */}
              {/*   <source src="/orbs1.webm" type="video/webm; codecs='vp9'" /> */}
              {/*   <source src="/orbs1.mp4" type="video/mp4" /> */}
              {/* </video> */}
              <StyledErrorBoundary>
                <SupplyWidgets />
              </StyledErrorBoundary>
          <div
            className={`
              absolute
              w-full
              h-[500px] -mt-[50px]
              lg:h-[700px]
              xl:h-[800px]
              2xl:h-[800px]
              -z-10
            `}
          >
            <Image
              className=""
              alt=""
              src={headerGlowSvg as StaticImageData}
              layout="fill"
              priority
              quality={100}
              objectFit="cover"
            />
          </div>
              <SectionDivider
                link="burn"
                subtitle="it's getting hot in here"
                title="the burn"
              />
              <StyledErrorBoundary>
                <WidgetGroup1 />
              </StyledErrorBoundary>
              {/* <video */}
              {/*   className="absolute w-1/2 right-0 -mt-64 opacity-20 -z-10" */}
              {/*   playsInline */}
              {/*   autoPlay */}
              {/*   muted */}
              {/*   loop */}
              {/*   poster="/orbs2.jpg" */}
              {/* > */}
              {/*   <source src="/orbs2.webm" type="video/webm; codecs='vp9'" /> */}
              {/*   <source src="/orbs2.mp4" type="video/mp4" /> */}
              {/* </video> */}
              <SectionDivider
                title="total value secured—TVS"
                subtitle="securing the internet of value"
              />
              <StyledErrorBoundary>
                <div className="flex flex-col px-4 md:px-16">
                  <TotalValueSecured></TotalValueSecured>
                </div>
              </StyledErrorBoundary>
              <SectionDivider
                title="monetary premium"
                subtitle="the race to become the most desirable money"
              />
              <StyledErrorBoundary>
                <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4 px-4 md:px-16">
                  {/* <video */}
                  {/*   className="absolute w-1/2 -left-20 -mt-96 opacity-20 -z-10 -mr-8" */}
                  {/*   playsInline */}
                  {/*   autoPlay */}
                  {/*   muted */}
                  {/*   loop */}
                  {/*   poster="/orbs1.jpg" */}
                  {/* > */}
                  {/*   <source src="/orbs1.webm" type="video/webm; codecs='vp9'" /> */}
                  {/*   <source src="/orbs1.mp4" type="video/mp4" /> */}
                  {/* </video> */}
                  <div className="flex flex-col basis-1/2 gap-y-4">
                    <Scarcity />
                    <ValidatorRewardsWidget />
                    <Flippenings />
                  </div>
                  <div className="basis-1/2 flex flex-col gap-y-4">
                    <PriceModel />
                    <IssuanceBreakdown />
                  </div>
                </div>
              </StyledErrorBoundary>
              <StyledErrorBoundary>
                <div className="flex flex-col px-4 md:px-16">
                  <div
                    id="fam"
                    className="relative flex px-4 md:px-0 pt-40 mb-16"
                  >
                    <div className="w-full relative flex flex-col items-center">
                      {/* <video */}
                      {/*   className="absolute w-2/3 right-0 -mr-16 -mt-48 opacity-100 -z-10 hidden md:block" */}
                      {/*   playsInline */}
                      {/*   autoPlay */}
                      {/*   muted */}
                      {/*   loop */}
                      {/*   poster="/orbs2.jpg" */}
                      {/* > */}
                      {/*   <source src="/orbs2.webm" type="video/webm; codecs='vp9'" /> */}
                      {/*   <source src="/orbs2.mp4" type="video/mp4" /> */}
                      {/* </video> */}
                      <TwitterFam />
                    </div>
                  </div>
                  <div className="flex px-4 md:px-0 pt-20 pb-20">
                    <div className="w-full lg:w-2/3 md:m-auto relative">
                      <FollowingYou />
                    </div>
                  </div>
                  <div className="flex px-4 md:px-0 pt-8">
                    <div className="w-full lg:w-2/3 md:m-auto relative">
                      <FaqBlock />
                    </div>
                  </div>
                </div>
              </StyledErrorBoundary>
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
                      href="mailto:contact@ultrasound.money"
                    >
                      <TextInterLink>contact@ultrasound.money</TextInterLink>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </FeatureFlagsContext.Provider>
    </StyledErrorBoundary>
  );
};

export default Dashboard;
