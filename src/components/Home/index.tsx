import * as Sentry from "@sentry/react";
import React, { FC } from "react";
import FollowingYou from "../FollowingYou";
import FaqBlock from "../Landing/faq";
import SupplyView from "../SupplyView";
import { SectionTitle } from "../Texts";
import TwitterCommunity from "../TwitterCommunity";
import Flippenings from "./Flippenings";
import Scarcity from "./Scarcity";
import TopBar from "./TopBar";
import WidgetGroup1 from "../widget-group-1";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Colors from "../../colors";

const SectionDivider: FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <>
    <div className="h-32"></div>
    <SectionTitle title={title} subtitle={subtitle} />
    <div className="h-10 xl:h-16"></div>
  </>
);

const Home: FC = () => (
  <SkeletonTheme
    baseColor={Colors.dusk}
    highlightColor="#565b7f"
    enableAnimation={true}
  >
    <div className="wrapper bg-blue-midnightexpress blurred-bg-image">
      <div className="container m-auto">
        <div className="px-4 md:px-16">
          <TopBar />
        </div>
        <div
          className={`ultra-sound-text w-full pt-16 text-6xl md:text-7xl md:w-1/2 lg:w-5/6 lg:pt-16 m-auto mb-8`}
        >
          ultra sound awakening
        </div>
        <p className="font-inter font-light text-blue-spindle text-xl md:text-2xl lg:text-3xl text-white text-center mb-16">
          track ETH become ultra sound
        </p>
        <video
          className="w-full md:w-3/6 lg:w-2/6 mx-auto -mt-32 -mb-4 pr-6 mix-blend-lighten"
          playsInline
          autoPlay
          muted
          loop
          poster="/bat-no-wings.png"
        >
          <source src="/bat-no-wings.webm" type="video/webm; codecs='vp9'" />
          <source src="/bat-no-wings.mp4" type="video/mp4" />
        </video>
        {/* <video */}
        {/*   className="absolute left-0 -ml-24 top-8 md:top-128 lg:top-96 opacity-40 mix-blend-lighten" */}
        {/*   playsInline */}
        {/*   autoPlay */}
        {/*   muted */}
        {/*   loop */}
        {/*   poster="/moving-orbs.jpg" */}
        {/* > */}
        {/*   <source src="/moving-orbs.mp4" type="video/mp4" /> */}
        {/*   <source src="/moving-orbs.webm" type="video/webm; codecs='vp9'" /> */}
        {/* </video> */}
        <Sentry.ErrorBoundary
          fallback={
            <div className="bg-blue-tangaroa w-4/6 m-auto p-8 rounded-lg font-roboto text-white text-xl text-center">
              an unexpected exception occured, devs have been notified.
            </div>
          }
        >
          <WidgetGroup1 />
        </Sentry.ErrorBoundary>
        <SectionDivider
          title="monetary premium"
          subtitle="the race to become the most desirable money"
        />
        <div className="flex items-start flex-col lg:flex-row gap-y-4 lg:gap-4 px-4 md:px-16">
          <Scarcity />
          <Flippenings />
        </div>
        <div className="flex flex-col px-4 md:px-16">
          <SectionDivider
            title="project the supply"
            subtitle="get ready for a peakening"
          />
          <div className="w-full md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
            <SupplyView />
          </div>
          <div
            id="join-the-fam"
            className="relative flex px-4 md:px-0 pt-8 pt-40 mb-16"
          >
            <div className="w-full relative flex flex-col items-center">
              {/* <video */}
              {/*   className="absolute w-1/2 right-0 -mt-16 opacity-40 mix-blend-lighten" */}
              {/*   playsInline */}
              {/*   autoPlay */}
              {/*   muted */}
              {/*   loop */}
              {/*   poster="/bat-no-wings.png" */}
              {/* > */}
              {/*   <source src="/moving-orbs.webm" type="video/webm; codecs='vp9'" /> */}
              {/*   <source src="/moving-orbs.mp4" type="video/mp4" /> */}
              {/* </video> */}
              <TwitterCommunity />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-20 pb-20">
            <div className="w-full lg:w-2/3 md:m-auto relative">
              <FollowingYou />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-8 pb-60">
            <div className="w-full lg:w-2/3 md:m-auto relative">
              <FaqBlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default Home;
